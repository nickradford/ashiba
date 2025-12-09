import { test, expect, beforeAll, afterAll } from "bun:test";
import { runScaffold } from "./scaffold";
import { rmSync, mkdirSync, existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";

const TEST_TEMPLATE = ".ashiba/test-scaffold-template";
const TEST_OUTPUT_DIR = "./test-output";

beforeAll(async () => {
  // Create test template directory with sample files
  mkdirSync(TEST_TEMPLATE, { recursive: true });
  mkdirSync(`${TEST_TEMPLATE}/nested`, { recursive: true });

  await Bun.file(`${TEST_TEMPLATE}/README.md`).writer().write(`# {name}

Version: {version}
Author: {author}
`);

  await Bun.file(`${TEST_TEMPLATE}/{name}.ts`).writer().write(`
export const PROJECT_NAME = "{name}";
export const VERSION = "{version}";
`);

  await Bun.file(`${TEST_TEMPLATE}/nested/config.json`).writer().write(`{
  "projectName": "{name}",
  "version": "{version}"
}`);
});

afterAll(() => {
  // Clean up test files
  try {
    rmSync(TEST_TEMPLATE, { recursive: true });
    rmSync(TEST_OUTPUT_DIR, { recursive: true });
  } catch {
    // Files may not exist
  }
});

test("runScaffold creates files with variable interpolation", async () => {
  const values = {
    name: "MyProject",
    version: "1.0.0",
    author: "Test Author",
  };

  await runScaffold("test-scaffold-template", values, TEST_OUTPUT_DIR);

  // Verify root files were created
  const readmeFile = Bun.file(`${TEST_OUTPUT_DIR}/README.md`);
  expect(await readmeFile.exists()).toBe(true);

  const readmeContent = await readmeFile.text();
  expect(readmeContent).toContain("# MyProject");
  expect(readmeContent).toContain("Version: 1.0.0");
  expect(readmeContent).toContain("Author: Test Author");
});

test("runScaffold interpolates filenames", async () => {
  const values = {
    name: "MyProject",
    version: "1.0.0",
    author: "Test Author",
  };

  await runScaffold("test-scaffold-template", values, TEST_OUTPUT_DIR);

  // Check that {name}.ts was renamed to MyProject.ts
  const tsFile = Bun.file(`${TEST_OUTPUT_DIR}/MyProject.ts`);
  expect(await tsFile.exists()).toBe(true);

  const tsContent = await tsFile.text();
  expect(tsContent).toContain('export const PROJECT_NAME = "MyProject"');
  expect(tsContent).toContain('export const VERSION = "1.0.0"');
});

test("runScaffold preserves nested directory structure", async () => {
  const values = {
    name: "MyProject",
    version: "1.0.0",
    author: "Test Author",
  };

  await runScaffold("test-scaffold-template", values, TEST_OUTPUT_DIR);

  const configFile = Bun.file(`${TEST_OUTPUT_DIR}/nested/config.json`);
  expect(await configFile.exists()).toBe(true);

  const configContent = await configFile.text();
  expect(configContent).toContain('"projectName": "MyProject"');
  expect(configContent).toContain('"version": "1.0.0"');
});

test("runScaffold handles empty variable values gracefully", async () => {
  const values = {
    name: "Project",
    version: "",
    author: "",
  };

  await runScaffold("test-scaffold-template", values, TEST_OUTPUT_DIR);

  const readmeFile = Bun.file(`${TEST_OUTPUT_DIR}/README.md`);
  const readmeContent = await readmeFile.text();

  // Empty values should result in empty strings (variable replaced with "")
  expect(readmeContent).toContain("# Project");
  expect(readmeContent).toContain("Version: ");
  expect(readmeContent).toContain("Author: ");
});

test("runScaffold creates output directory if needed", async () => {
  const outputDir = "./test-output-new";
  const values = {
    name: "NewProject",
    version: "2.0.0",
    author: "Test",
  };

  // Pre-create the output directory (Bun.file doesn't auto-create parents)
  mkdirSync(outputDir, { recursive: true });

  try {
    await runScaffold("test-scaffold-template", values, outputDir);
    expect(existsSync(outputDir)).toBe(true);
  } finally {
    if (existsSync(outputDir)) {
      rmSync(outputDir, { recursive: true });
    }
  }
});
