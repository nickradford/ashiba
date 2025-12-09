import * as TOML from "@ltd/j-toml";
import pc from "picocolors";
import { type } from "arktype";

// ---------------------------------------------------------------------------
// 1) TemplateField – typed variants
// ---------------------------------------------------------------------------

const BaseField = type({
  __key: "string",
  description: "string?",
  "[string]": "unknown",
});

export const TextField = BaseField.and(type({ __type: "'string'" }));
export type TextField = typeof TextField.infer;

export const NumberField = BaseField.and(
  type({
    __type: "'number'",
    min: "number?",
    max: "number?",
    initial: "number?",
  }),
);
export type NumberField = typeof NumberField.infer;

export const SelectField = BaseField.and(
  type({ __type: "'select'", select: "string[]" }),
);
export type SelectField = typeof SelectField.infer;

export const ConfirmField = BaseField.and(
  type({ __type: "'confirm'", confirm: "true" }),
);
export type ConfirmField = typeof ConfirmField.infer;

export const TemplateField = TextField.or(NumberField)
  .or(SelectField)
  .or(ConfirmField);
export type TemplateField = typeof TemplateField.infer;

// ---------------------------------------------------------------------------
// 2) TemplateConfig – TypeScript-level structure
// ---------------------------------------------------------------------------

export type TemplateConfig<
  Order extends readonly string[] = readonly string[],
> = {
  order: Order;
  description?: string;
} & {
  [K in Order[number]]: TemplateField;
} & { [key: string]: TemplateField | Order | string | undefined };

// ---------------------------------------------------------------------------
// 3) Runtime TemplateConfig validator
// ---------------------------------------------------------------------------

/**
 * The top-level validator just ensures object-y shape;
 * individual fields will be verified after normalization.
 */
export const TemplateConfigRuntime = type({
  order: "string[]",
  description: "string?",
  "[string]": "object | string",
});

// ---------------------------------------------------------------------------
// 4) Helpers
// ---------------------------------------------------------------------------

export function validateTemplateConfigPresence<
  T extends { order: string[] } & Record<string, unknown>,
>(cfg: T): { ok: true } | { ok: false; missing: string[] } {
  const missing = cfg.order.filter((k) => !(k in cfg));
  return missing.length ? { ok: false, missing } : { ok: true };
}

/**
 * Normalize all fields:
 * - add __key
 * - infer type if missing
 * - transform confirm/string -> confirm:true
 */
function normalizeKeys(config: any): TemplateConfig {
  for (const key of config.order) {
    const field = config[key];
    if (!field || typeof field !== "object") continue;

    field.__key = key;

    // confirm field using TOML key or string confirm
    if (typeof field.confirm === "string") {
      field.description = field.confirm;
      field.confirm = true;
    }

    if (field.type === "number") {
      field.__type = "number";
      console.log(field);
    }

    // infer types if not declared
    if ("select" in field && !field.__type) {
      field.__type = "select";
    } else if ("confirm" in field && !field.__type) {
      field.__type = "confirm";
    } else if (typeof field.__type !== "string") {
      // default to string input if none provided
      field.__type = "string";
    }
  }

  console.log({ config });

  return config as TemplateConfig;
}

// ---------------------------------------------------------------------------
// 5) loadConfig – parse + normalize + validate deeply
// ---------------------------------------------------------------------------

export async function loadConfig(template: string): Promise<TemplateConfig> {
  const configFile = Bun.file(`.ashiba/${template}.toml`);
  if (!(await configFile.exists())) {
    throw new Error(`Config file not found for template: ${template}`);
  }

  const parsed = TOML.parse(await configFile.text(), { bigint: false }) as any;

  const presence = validateTemplateConfigPresence(parsed);
  if (!presence.ok) {
    throw new Error(
      `Config is missing information for keys: ${presence.missing.join(", ")}`,
    );
  }

  const coarse = TemplateConfigRuntime(parsed);
  if (coarse instanceof type.errors) {
    console.error(pc.red("TemplateConfig validation failed:"));
    console.error(coarse.issues);
    throw new Error(coarse.summary);
  }

  const normalized = normalizeKeys(coarse);

  // deep validate each field with TemplateField
  for (const key of normalized.order) {
    const field = normalized[key];
    const valid = TemplateField(field);
    if (valid instanceof type.errors) {
      console.error(
        pc.red(`Validation failed for field "${key}": ${valid.summary}`),
      );
      throw new Error(valid.summary);
    }
  }

  console.log({ normalized });

  return normalized;
}
