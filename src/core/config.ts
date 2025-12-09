import * as TOML from "@ltd/j-toml";
import pc from "picocolors";
import { type } from "arktype";

// 1) Runtime value type for each dynamic entry. Expandable over time.
// You can add more fields as needed (e.g., "default", "required", etc.)
export const TemplateField = type({
  // allow any future keys -> do not reject undeclared field properties
  description: "string?",
  "[string]": "unknown", // permit additional arbitrary properties on each field object
});
export type TemplateField = typeof TemplateField.infer;

// 2) TypeScript coupling: for every key listed in `order`, there must be
// a corresponding property with TemplateField value.
// Extra keys (beyond `order`) are allowed; remove the index signature
// if you want to disallow extras at the TS level.
export type TemplateConfig<
  Order extends readonly string[] = readonly string[],
> = {
  order: Order extends readonly string[] ? Order : readonly string[];
  description?: string; // optional template-level description
} & {
  [K in Order[number]]: TemplateField;
} & {
  // allow additional dynamic keys not necessarily listed in `order`
  [key: string]: TemplateField | Order | string | undefined;
};

// 3) Runtime validator:
// - order must be an array of strings
// - any string-keyed property can be a TemplateField or string (for description)
// - keep the object "open" so future keys are allowed
export const TemplateConfigRuntime = type({
  order: "string[]", // array of strings (any length)
  // any string key maps to an object (TemplateField) or string (description)
  "[string]": "object | string",
});

// Optional: stricter runtime that ensures every key in order exists.
// ArkType (as of today) can validate shapes and keys individually,
// but coupling “order elements must exist as keys” is best enforced at TypeScript level.
// Provide a tiny runtime helper to check presence if you need it:

export function validateTemplateConfigPresence<
  T extends { order: string[] } & Record<string, unknown>,
>(cfg: T): { ok: true } | { ok: false; missing: string[] } {
  const missing = cfg.order.filter((k) => !(k in cfg));
  return missing.length === 0 ? { ok: true } : { ok: false, missing };
}

export async function loadConfig(template: string): Promise<TemplateConfig> {
  const configFile = Bun.file(`.ashiba/${template}.toml`);
  if (!(await configFile.exists())) {
    throw new Error(`Config file not found for template: ${template}`);
  }

  const parsed = TOML.parse(await configFile.text(), 1.0) as any;

  const presence = validateTemplateConfigPresence(parsed);
  if (!presence.ok) {
    throw new Error(
      `Config is missing information for keys: ${presence.missing.join(", ")}`,
    );
  }
  const config = TemplateConfigRuntime(parsed);

  if (config instanceof type.errors) {
    console.error(config.issues);
    throw new Error(config.summary);
  }

  return config;
}
