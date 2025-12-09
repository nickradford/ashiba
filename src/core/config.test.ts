import { test, expect, beforeAll, afterAll } from "bun:test";
import {
  loadConfig,
  validateTemplateConfigPresence,
  type TemplateConfig,
} from "./config";
import path from "node:path";
import { rmSync } from "node:fs";

beforeAll(async () => {
  // Create test template directory
  const testDir = ".ashiba/test-template";
  await Bun.file(`${testDir}.toml`).writer().write(`
order = ["name", "version"]

[name]
description = "Project name"

[version]
description = "Project version"
`);
});

afterAll(() => {
  // Clean up test files
  try {
    rmSync(".ashiba/test-template.toml");
    rmSync(".ashiba/test-missing.toml");
    rmSync(".ashiba/test-invalid.toml");
  } catch {
    // Files may not exist
  }
});

test("loadConfig loads a valid TOML template", async () => {
  const config = await loadConfig("test-template");

  expect(config.order).toEqual(["name", "version"]);
  expect(config.name).toBeDefined();
  expect(config.version).toBeDefined();
  expect(config.name?.description).toBe("Project name");
  expect(config.version?.description).toBe("Project version");
});

test("loadConfig throws when template file does not exist", async () => {
  expect(async () => {
    await loadConfig("nonexistent-template");
  }).toThrow();
});

test("validateTemplateConfigPresence returns ok:true for valid config", () => {
  const validConfig = {
    order: ["field1", "field2"],
    field1: { description: "First field" },
    field2: { description: "Second field" },
  };

  const result = validateTemplateConfigPresence(validConfig);

  expect(result.ok).toBe(true);
});

test("validateTemplateConfigPresence returns missing fields", () => {
  const invalidConfig = {
    order: ["field1", "field2", "field3"],
    field1: { description: "First field" },
    field2: { description: "Second field" },
  };

  const result = validateTemplateConfigPresence(invalidConfig);

  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.missing).toContain("field3");
  }
});

test("loadConfig throws when order references missing fields", async () => {
  // Create a template with missing field references
  await Bun.file(".ashiba/test-missing.toml").writer().write(`
order = ["name", "missing_field"]

[name]
description = "Project name"
`);

  expect(async () => {
    await loadConfig("test-missing");
  }).toThrow();
});
