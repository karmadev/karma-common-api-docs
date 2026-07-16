#!/usr/bin/env node
/**
 * generate-changelog.mjs — append an API changelog entry from an OpenAPI spec diff.
 *
 * Run this as part of the manual publish flow, BEFORE overwriting public/latest/openapi.json,
 * so the "old" spec is still the currently-published one:
 *
 *   cd ../karma-common-api && npm run export-openapi -- --output=/tmp/api-docs
 *   cd ../karma-common-api-docs
 *   node scripts/generate-changelog.mjs --new /tmp/api-docs/openapi.json   # (--old defaults to public/latest/openapi.json)
 *   # ...then copy the new spec into public/latest + public/versions, build, commit, push.
 *
 * It diffs the two specs, asks Claude to write a human changelog entry, prepends it to
 * changelog.json (source of truth), and regenerates pages/changelog.mdx (the pre-rendered page).
 *
 * Degrades gracefully: with no ANTHROPIC_API_KEY (or on any API error) it writes a
 * structural-only entry derived directly from the diff, so the publish never hard-fails.
 * With no structural diff at all, it is a no-op.
 *
 * Flags: --new <path> (required) --old <path> --commit <sha> --date <YYYY-MM-DD>
 *        --version <v...> --model <id> --dry-run
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHANGELOG_JSON = path.join(ROOT, "changelog.json");
const CHANGELOG_MDX = path.join(ROOT, "pages", "changelog.mdx");
const MODEL_DEFAULT = "claude-opus-4-8";
const METHODS = ["get", "post", "put", "patch", "delete"];
const CHANGE_TYPES = ["added", "changed", "removed", "deprecated", "fixed"];

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) { args[key] = next; i++; }
      else args[key] = true;
    }
  }
  return args;
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function today() {
  // No Date.now() reliance for determinism concerns — this is a CLI run by a human.
  return new Date().toISOString().slice(0, 10);
}

function gitShortSha() {
  try {
    return execSync("git rev-parse --short HEAD", { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] })
      .toString().trim();
  } catch { return null; }
}

// Resolve a single level of $ref into components.schemas; return the property-name set.
function propNames(spec, schema) {
  if (!schema || typeof schema !== "object") return [];
  let s = schema;
  if (s.$ref && typeof s.$ref === "string") {
    const name = s.$ref.split("/").pop();
    s = spec.components?.schemas?.[name] ?? {};
  }
  const props = s.properties && typeof s.properties === "object" ? Object.keys(s.properties) : [];
  return props;
}

function opSignature(spec, op) {
  if (!op || typeof op !== "object") return { req: [], res: [] };
  const reqSchema = op.requestBody?.content?.["application/json"]?.schema;
  const resSchema =
    op.responses?.["200"]?.content?.["application/json"]?.schema ??
    op.responses?.["201"]?.content?.["application/json"]?.schema;
  return { req: propNames(spec, reqSchema), res: propNames(spec, resSchema) };
}

function diffArrays(oldArr, newArr) {
  const o = new Set(oldArr), n = new Set(newArr);
  return {
    added: [...n].filter((x) => !o.has(x)),
    removed: [...o].filter((x) => !n.has(x)),
  };
}

function computeDiff(oldSpec, newSpec) {
  const oldPaths = oldSpec.paths ?? {};
  const newPaths = newSpec.paths ?? {};
  const allPaths = new Set([...Object.keys(oldPaths), ...Object.keys(newPaths)]);

  const addedOps = [];    // { method, path, summary }
  const removedOps = [];  // { method, path }
  const changedOps = [];  // { method, path, summary, reqAdded, reqRemoved, resAdded, resRemoved }

  for (const p of allPaths) {
    const oldItem = oldPaths[p] ?? {};
    const newItem = newPaths[p] ?? {};
    for (const m of METHODS) {
      const oldOp = oldItem[m];
      const newOp = newItem[m];
      if (!oldOp && newOp) {
        addedOps.push({ method: m.toUpperCase(), path: p, summary: newOp.summary || newOp.operationId || "" });
      } else if (oldOp && !newOp) {
        removedOps.push({ method: m.toUpperCase(), path: p });
      } else if (oldOp && newOp) {
        const a = opSignature(oldSpec, oldOp);
        const b = opSignature(newSpec, newOp);
        const req = diffArrays(a.req, b.req);
        const res = diffArrays(a.res, b.res);
        if (req.added.length || req.removed.length || res.added.length || res.removed.length) {
          changedOps.push({
            method: m.toUpperCase(), path: p,
            summary: newOp.summary || newOp.operationId || "",
            reqAdded: req.added, reqRemoved: req.removed,
            resAdded: res.added, resRemoved: res.removed,
          });
        }
      }
    }
  }
  return { addedOps, removedOps, changedOps };
}

function diffIsEmpty(d) {
  return !d.addedOps.length && !d.removedOps.length && !d.changedOps.length;
}

// Deterministic fallback entry from the structural diff (no LLM).
function structuralEntry(d) {
  const changes = [];
  for (const op of d.addedOps) changes.push({ type: "added", text: `${op.method} ${op.path}${op.summary ? ` — ${op.summary}` : ""}` });
  for (const op of d.removedOps) changes.push({ type: "removed", text: `${op.method} ${op.path}` });
  for (const op of d.changedOps) {
    const bits = [];
    if (op.reqAdded.length) bits.push(`request +${op.reqAdded.join(", ")}`);
    if (op.reqRemoved.length) bits.push(`request −${op.reqRemoved.join(", ")}`);
    if (op.resAdded.length) bits.push(`response +${op.resAdded.join(", ")}`);
    if (op.resRemoved.length) bits.push(`response −${op.resRemoved.join(", ")}`);
    changes.push({ type: "changed", text: `${op.method} ${op.path} — ${bits.join("; ")}` });
  }
  const parts = [];
  if (d.addedOps.length) parts.push(`${d.addedOps.length} endpoint(s) added`);
  if (d.changedOps.length) parts.push(`${d.changedOps.length} endpoint(s) changed`);
  if (d.removedOps.length) parts.push(`${d.removedOps.length} endpoint(s) removed`);
  return { summary: parts.join(", ") + ".", changes };
}

async function llmEntry(diff, model) {
  const key = process.env.ANTHROPIC_API_KEY;
  // new Anthropic() also resolves an `ant auth login` profile, but for a CLI we require a key
  // to be explicit; without one we fall back to the structural entry.
  if (!key) return null;
  let Anthropic;
  try {
    ({ default: Anthropic } = await import("@anthropic-ai/sdk"));
  } catch {
    console.warn("[changelog] @anthropic-ai/sdk not installed — using structural entry. Run `npm install`.");
    return null;
  }
  const client = new Anthropic();
  const schema = {
    type: "object",
    additionalProperties: false,
    properties: {
      summary: { type: "string", description: "One or two sentences, plain English, for external API consumers." },
      changes: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            type: { type: "string", enum: CHANGE_TYPES },
            text: { type: "string", description: "One concise, consumer-facing sentence. Name the endpoint and field(s)." },
          },
          required: ["type", "text"],
        },
      },
    },
    required: ["summary", "changes"],
  };
  const prompt =
    "You write changelog entries for a public REST API (the Karma Common API), for external integrators.\n" +
    "Below is a STRUCTURAL diff of the OpenAPI spec between the currently-published version and a new export.\n" +
    "Turn it into a factual changelog entry. Rules: only describe what the diff shows (do not invent changes); " +
    "be concise and consumer-facing; group related field changes; prefer 'added'/'changed'/'removed'; use endpoint " +
    "paths and field names from the diff.\n\n" +
    "DIFF:\n" + JSON.stringify(diff, null, 2);
  try {
    const resp = await client.messages.create({
      model: model || MODEL_DEFAULT,
      max_tokens: 2048,
      output_config: { format: { type: "json_schema", schema } },
      messages: [{ role: "user", content: prompt }],
    });
    const text = resp.content.find((b) => b.type === "text")?.text;
    if (!text) return null;
    const parsed = JSON.parse(text);
    if (!parsed.summary || !Array.isArray(parsed.changes)) return null;
    parsed.changes = parsed.changes.filter((c) => CHANGE_TYPES.includes(c.type) && typeof c.text === "string");
    return parsed;
  } catch (err) {
    console.warn(`[changelog] LLM entry failed (${err?.message ?? err}) — using structural entry.`);
    return null;
  }
}

function renderMdx(changelog) {
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const header =
    "---\n" +
    "title: Changelog\n" +
    "description: Notable changes to the Karma Common API, newest first.\n" +
    "---\n\n" +
    "{/* GENERATED FILE — do not edit by hand. Regenerate with `npm run changelog` (scripts/generate-changelog.mjs). Source of truth: changelog.json */}\n\n" +
    "Notable changes to the Karma Common API, newest first. Each entry corresponds to a\n" +
    "published revision of the API reference.\n";
  const body = changelog.entries
    .map((e) => {
      const lines = [`## ${e.date}`];
      for (const c of e.changes) lines.push(`**${cap(c.type)}** — ${c.text}`);
      return lines.join("\n\n");
    })
    .join("\n\n");
  return header + "\n" + body + "\n";
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.new) {
    console.error("Usage: node scripts/generate-changelog.mjs --new <openapi.json> [--old <openapi.json>] [--commit <sha>] [--date <YYYY-MM-DD>] [--version <v>] [--dry-run]");
    process.exit(2);
  }
  const oldPath = args.old || path.join(ROOT, "public", "latest", "openapi.json");
  const newSpec = readJson(args.new);
  const oldSpec = fs.existsSync(oldPath) ? readJson(oldPath) : { paths: {} };

  const diff = computeDiff(oldSpec, newSpec);
  if (diffIsEmpty(diff)) {
    console.log("[changelog] No structural spec changes — nothing to add.");
    return;
  }

  const generated = (await llmEntry(diff, args.model)) || structuralEntry(diff);

  let version = args.version;
  try {
    version = version || readJson(path.join(ROOT, "public", "latest", "version.json")).version;
  } catch { /* optional */ }

  const entry = {
    date: args.date || today(),
    ...(version ? { version } : {}),
    commit: args.commit || gitShortSha() || undefined,
    summary: generated.summary,
    changes: generated.changes,
  };

  const changelog = readJson(CHANGELOG_JSON);
  changelog.entries.unshift(entry);
  const mdx = renderMdx(changelog);

  if (args["dry-run"]) {
    console.log("[changelog] DRY RUN — entry that would be prepended:\n");
    console.log(JSON.stringify(entry, null, 2));
    return;
  }

  fs.writeFileSync(CHANGELOG_JSON, JSON.stringify(changelog, null, 2) + "\n");
  fs.writeFileSync(CHANGELOG_MDX, mdx);
  console.log(`[changelog] Added entry for ${entry.date} (${entry.changes.length} change(s)). Review changelog.json + pages/changelog.mdx, then build.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
