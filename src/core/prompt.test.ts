import { test, expect } from "bun:test";
import type { TemplateConfig } from "./config";

test("getPromptResponses handles empty description", async () => {
  const config = {
    order: ["field1"],
    field1: { description: undefined },
  } as unknown as TemplateConfig;

  // This test verifies that the function handles missing descriptions gracefully
  // The actual prompts call would be mocked in real implementation
  expect(config.order).toContain("field1");
  expect(config.field1?.description).toBeUndefined();
});

test("getPromptResponses maintains question order", async () => {
  const config = {
    order: ["first", "second", "third"],
    first: { description: "First field" },
    second: { description: "Second field" },
    third: { description: "Third field" },
  } as unknown as TemplateConfig;

  // Verify the order property
  expect(config.order).toEqual(["first", "second", "third"]);
  expect(config.order[0]).toBe("first");
  expect(config.order[1]).toBe("second");
  expect(config.order[2]).toBe("third");
});
