import { test, expect } from "bun:test";
import { listTemplates } from "./templates";

test("listTemplates returns array of template names", async () => {
  const templates = await listTemplates();
  expect(Array.isArray(templates)).toBe(true);
  expect(templates.length).toBeGreaterThan(0);
});

test("listTemplates includes test template", async () => {
  const templates = await listTemplates();
  expect(templates).toContain("test");
});

test("listTemplates only returns .toml files without extension", async () => {
  const templates = await listTemplates();
  templates.forEach((template) => {
    expect(template).not.toMatch(/\.toml$/);
    expect(template).not.toContain(".");
  });
});
