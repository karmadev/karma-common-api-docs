import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import type { ZudokuBuildConfig } from "zudoku";

const here = dirname(fileURLToPath(import.meta.url));
const specsDir = resolve(here, "specs");

const readJson = async <T = unknown>(file: string): Promise<T> => {
  const buf = await readFile(resolve(specsDir, file), "utf8");
  return JSON.parse(buf) as T;
};

type Fragment = {
  $karmaOverrides?: Record<string, unknown>;
  tag?: { name: string; description?: string };
  tags?: Array<{ name: string; description?: string }>;
  paths?: Record<string, unknown>;
  webhooks?: Record<string, unknown>;
  components?: { schemas?: Record<string, unknown> };
};

const addTagIfMissing = (spec: any, tag: { name: string; description?: string }) => {
  spec.tags = spec.tags ?? [];
  if (!spec.tags.some((t: any) => t.name === tag.name)) {
    spec.tags.push(tag);
  }
};

const mergeFragment = (spec: any, fragment: Fragment) => {
  if (fragment.$karmaOverrides) Object.assign(spec, fragment.$karmaOverrides);
  if (fragment.tag) addTagIfMissing(spec, fragment.tag);
  if (Array.isArray(fragment.tags)) {
    for (const t of fragment.tags) addTagIfMissing(spec, t);
  }
  if (fragment.paths) {
    spec.paths = spec.paths ?? {};
    Object.assign(spec.paths, fragment.paths);
  }
  if (fragment.webhooks) {
    spec.webhooks = spec.webhooks ?? {};
    Object.assign(spec.webhooks, fragment.webhooks);
  }
  if (fragment.components?.schemas) {
    spec.components = spec.components ?? {};
    spec.components.schemas = spec.components.schemas ?? {};
    Object.assign(spec.components.schemas, fragment.components.schemas);
  }
};

// Zudoku 0.77's WebhookItem GraphQL type has no `tags` field, so entries under
// `webhooks:` cannot be grouped under a resource tag in the sidebar — they all
// land on a single dedicated /webhooks page. To surface each event beside the
// CRUD endpoints of its resource (Inventory, Orders, etc.), we move every
// webhook out of `webhooks:` and into `paths:` under a synthetic URL prefixed
// with `/webhook/`. The operation keeps its existing tag (e.g. "Inventory"),
// so Zudoku groups it under that tag. We prefix the summary with "Webhook:"
// so the reader can tell at a glance that this isn't an endpoint they call —
// it's an event Karma POSTs to their configured webhook URL.
const webhooksToPaths = (spec: any) => {
  if (!spec.webhooks) return;
  spec.paths = spec.paths ?? {};
  for (const [eventName, pathItem] of Object.entries<any>(spec.webhooks)) {
    const syntheticPath = `/webhook/${eventName}`;
    const transformed: Record<string, any> = {};
    for (const [method, op] of Object.entries<any>(pathItem)) {
      if (!op || typeof op !== "object") continue;
      const summary = op.summary ?? eventName;
      transformed[method] = {
        ...op,
        summary: summary.startsWith("Webhook:") ? summary : `Webhook: ${summary}`,
        operationId: op.operationId ?? `webhook_${eventName.replace(/\./g, "_")}`,
      };
    }
    spec.paths[syntheticPath] = transformed;
  }
  delete spec.webhooks;
};

// Zudoku 0.77's `flattenAllOfProcessor` runs BEFORE our `karmaFragmentMerge`
// (see node_modules/zudoku/src/vite/api/SchemaManager.ts), so any `allOf`
// introduced by our merged-in fragments never gets flattened — and the
// renderer skips webhook request-body schemas that are still raw `allOf`,
// leaving the "Request Body" section empty. Our webhook events all use
// `allOf: [WebhookEnvelope, {event-specific data shape}]`, so we flatten
// that pattern here, after refs are inlined and before fragments are merged.
const flattenAllOfDeep = (node: unknown): unknown => {
  if (Array.isArray(node)) return node.map(flattenAllOfDeep);
  if (!node || typeof node !== "object") return node;
  const obj = node as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) out[k] = flattenAllOfDeep(v);
  if (Array.isArray(out.allOf) && out.allOf.every((it) => {
    const o = it as Record<string, unknown> | null;
    return o && typeof o === "object" && (o.type === "object" || "properties" in o) && !("oneOf" in o) && !("anyOf" in o);
  })) {
    const merged: Record<string, unknown> = { type: "object" };
    const props: Record<string, unknown> = {};
    const required = new Set<string>();
    let description: string | undefined;
    let additionalProperties: unknown;
    for (const item of out.allOf as Array<Record<string, unknown>>) {
      if (typeof item.description === "string" && !description) description = item.description;
      const itemProps = item.properties as Record<string, unknown> | undefined;
      if (itemProps) Object.assign(props, itemProps);
      const req = item.required;
      if (Array.isArray(req)) for (const r of req) required.add(r as string);
      if ("additionalProperties" in item) additionalProperties = item.additionalProperties;
    }
    if (description) merged.description = description;
    if (Object.keys(props).length > 0) merged.properties = props;
    if (required.size > 0) merged.required = Array.from(required);
    if (additionalProperties !== undefined) merged.additionalProperties = additionalProperties;
    const { allOf: _drop, ...siblings } = out;
    return { ...merged, ...siblings };
  }
  return out;
};

// Zudoku 0.77's schema codegen corrupts the processed output when our merged
// spec contains $refs (the base spec is fully dereferenced — has zero $refs —
// but our fragments under specs/ still use them). The corruption manifests as
// stray `};` mid-file followed by orphaned content. Workaround: inline-resolve
// every #/components/schemas/X reference in each fragment before merging, so
// the merged schema is also fully dereferenced and Zudoku's $ref machinery
// stays out of the picture entirely.
const inlineRefs = (fragment: Fragment): Fragment => {
  const schemas = fragment.components?.schemas ?? {};
  const resolve = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(resolve);
    if (!node || typeof node !== "object") return node;
    const obj = node as Record<string, unknown>;
    const ref = obj.$ref;
    if (typeof ref === "string" && ref.startsWith("#/components/schemas/")) {
      const name = ref.slice("#/components/schemas/".length);
      const target = schemas[name];
      if (target) {
        // Recursively resolve refs inside the target too; siblings (rare) win
        // over the target's own keys, matching JSON Schema 2020-12 semantics.
        const { $ref: _drop, ...siblings } = obj;
        return { ...(resolve(target) as object), ...resolve(siblings) as object };
      }
    }
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) out[k] = resolve(v);
    return out;
  };
  return resolve(fragment) as Fragment;
};

const karmaFragmentMerge = async ({ schema }: { schema: any }) => {
  const [voucher, loyalty, webhookEvents] = await Promise.all([
    readJson<Fragment>("voucher-provider.openapi.json"),
    readJson<Fragment>("loyalty-provider.openapi.json"),
    readJson<Fragment>("webhook-events.openapi.json"),
  ]);

  // Clone the input schema before any mutation. Zudoku 0.77's pipeline appears
  // to hold/iterate the passed-in schema concurrently with our mutations,
  // producing character-level corruption in the generated output (truncated
  // strings, bleed-through from unrelated scopes) once the spec gets large.
  // Operating on a fresh clone sidesteps it.
  const cloned: any = structuredClone(schema);

  mergeFragment(cloned, flattenAllOfDeep(inlineRefs(voucher)) as Fragment);
  mergeFragment(cloned, flattenAllOfDeep(inlineRefs(loyalty)) as Fragment);
  mergeFragment(cloned, flattenAllOfDeep(inlineRefs(webhookEvents)) as Fragment);

  webhooksToPaths(cloned);

  delete cloned["x-tagGroups"];

  return cloned;
};

const buildConfig: ZudokuBuildConfig = {
  processors: [karmaFragmentMerge],
};

export default buildConfig;
