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
  await Bun.write(
    `${testDir}.toml`,
    `
order = ["name", "version"]

[name]
description = "Project name"

[version]
description = "Project version"
`,
  );
});

afterAll(() => {
  const files = [
    ".ashiba/test-template.toml",
    ".ashiba/test-missing.toml",
    ".ashiba/test-invalid.toml",
    ".ashiba/test-normalize.toml",
  ];

  for (const path of files) {
    try {
      rmSync(path, { force: true });
    } catch (error) {
      // Only show unexpected errors
      console.error("Failed to remove:", path, error);
    }
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
  await Bun.write(
    ".ashiba/test-missing.toml",
    `
order = ["name", "missing_field"]

[name]
description = "Project name"
`,
  );

  expect(async () => {
    await loadConfig("test-missing");
  }).toThrow();
});

test("loadConfig normalizes the keys into the TemplateField", async () => {
  await Bun.write(
    ".ashiba/test-normalize.toml",
    `
order = ["name"]

[name]
description = "Project name"
`,
  );
  const config = await loadConfig("test-normalize");
  expect(config.name!.__key).toBeDefined();
});
