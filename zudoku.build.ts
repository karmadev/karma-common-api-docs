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

const karmaFragmentMerge = async ({ schema }: { schema: any }) => {
  const [voucher, loyalty, webhookEvents] = await Promise.all([
    readJson<Fragment>("voucher-provider.openapi.json"),
    readJson<Fragment>("loyalty-provider.openapi.json"),
    readJson<Fragment>("webhook-events.openapi.json"),
  ]);

  mergeFragment(schema, voucher);
  mergeFragment(schema, loyalty);
  mergeFragment(schema, webhookEvents);

  webhooksToPaths(schema);

  delete schema["x-tagGroups"];

  return schema;
};

const buildConfig: ZudokuBuildConfig = {
  processors: [karmaFragmentMerge],
};

export default buildConfig;
