import { test, expect, beforeAll, afterAll } from "bun:test";
import { loadTemplateMetadata } from "./templates";

beforeAll(async () => {
  // Create a template with description
  const tomlContent = `
description = "A test template with description"
order = ["name"]

[name]
description = "Template name"
`;
  await Bun.file(".ashiba/with-description.toml").writer().write(tomlContent);
});

afterAll(async () => {
  try {
    await Bun.file(".ashiba/with-description.toml").delete();
  } catch {
    // Clean up
  }
});

test("loadTemplateMetadata returns name and description", async () => {
  const metadata = await loadTemplateMetadata("with-description");
  expect(metadata.name).toBe("with-description");
  expect(metadata.description).toBe("A test template with description");
});

test("loadTemplateMetadata returns description if provided", async () => {
  const metadata = await loadTemplateMetadata("test");
  expect(metadata.name).toBe("test");
  expect(metadata.description).toBe("A test scaffolding template");
});

test("loadTemplateMetadata throws for non-existent template", async () => {
  try {
    await loadTemplateMetadata("non-existent");
    expect(true).toBe(false); // Should not reach here
  } catch (error) {
    expect(error instanceof Error).toBe(true);
  }
});
