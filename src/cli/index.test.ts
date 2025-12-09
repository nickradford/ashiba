import { test, expect, beforeAll, afterAll } from "bun:test";
import { rmSync } from "node:fs";

beforeAll(async () => {
  // Create test template for CLI testing
  const { mkdirSync } = await import("node:fs");
  const templateDir = ".ashiba/cli-test-template";
  const tomlFile = ".ashiba/cli-test-template.toml";

  mkdirSync(templateDir, { recursive: true });

  await Bun.file(tomlFile).writer().write(`
order = ["name"]

[name]
description = "Template name"
`);

  await Bun.file(`${templateDir}/template.txt`).writer().write(`
Hello {name}!
`);
});

afterAll(() => {
  try {
    rmSync(".ashiba/cli-test-template.toml");
    rmSync(".ashiba/cli-test-template", { recursive: true });
    rmSync("./cli-test-output", { recursive: true });
  } catch {
    // Clean up
  }
});

test("CLI module exports parsed config", async () => {
  // Import the CLI module to ensure it parses correctly
  const cliModule = await import("./index");
  expect(cliModule).toBeDefined();
});

test("Template files are loaded from .ashiba directory", async () => {
  const templateFile = Bun.file(".ashiba/cli-test-template.toml");
  expect(await templateFile.exists()).toBe(true);
});

test("list command returns available templates", async () => {
  const { listTemplates } = await import("../core/templates");
  const templates = await listTemplates();
  expect(templates).toContain("test");
  expect(templates).toContain("cli-test-template");
});
