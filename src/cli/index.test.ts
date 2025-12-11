import { test, expect, beforeAll, afterAll } from "bun:test";
import { rmSync } from "node:fs";
import { createProgram } from "./index";

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

test("createProgram initializes with name and version", () => {
  const program = createProgram();
  expect(program.name()).toBe("ashiba");
  expect(program.version()).toBeDefined();
});

test("createProgram registers new command", () => {
  const program = createProgram();
  const newCmd = program.commands.find((c) => c.name() === "new");
  expect(newCmd).toBeDefined();
  expect(newCmd?.description()).toContain("Scaffold a new");
});

test("createProgram registers list command", () => {
  const program = createProgram();
  const listCmd = program.commands.find((c) => c.name() === "list");
  expect(listCmd).toBeDefined();
  expect(listCmd?.description()).toContain("List all available");
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
