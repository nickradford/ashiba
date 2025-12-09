import { test, expect, describe } from "bun:test";
import { type PromptObject } from "prompts";
import type { TemplateConfig } from "./config";
import {
  confirmTransformer,
  getPromptQuestionsFromConfig,
  getPromptResponses,
  numberTransformer,
  selectTransformer,
  textTransformer,
} from "./prompt";

describe("prompt", async () => {
  // TODO: update this to a more robust example
  test.skip("getPromptQuestionsFromConfig creates the correct structure for prompts library", async () => {
    const config = {
      order: ["first", "second", "third"],
      first: { __key: "first", type: "string", description: "First field" },
      second: { description: "Second field" },
      third: { description: "Third field" },
    } as unknown as TemplateConfig;

    const questions = getPromptQuestionsFromConfig(config);

    const expected = [
      {
        type: "text",
        name: "first",
        message: "First field",
      },
      {
        type: "text",
        name: "second",
        message: "Second field",
      },
      {
        type: "text",
        name: "third",
        message: "Third field",
      },
    ] as PromptObject[];

    expect(questions).toStrictEqual(expected);
  });

  describe("field types", async () => {
    test("supports text (default)", () => {
      const prompt = textTransformer({
        __key: "Author",
        __type: "string",
        description: "Who is writing this?",
      });

      expect(prompt).toStrictEqual({
        type: "text",
        name: "Author",
        message: "Who is writing this?",
      });
    });
    test("supports select", () => {
      const prompt = selectTransformer({
        __key: "favorite_author",
        __type: "select",
        description: "Who is the best author?",
        select: ["J. R. R. Tolkien", "Frank Herbert", "Dan Simmons"],
      });

      expect(prompt).toStrictEqual({
        type: "select",
        name: "favorite_author",
        message: "Who is the best author?",
        choices: [
          { title: "J. R. R. Tolkien", value: "J. R. R. Tolkien" },
          { title: "Frank Herbert", value: "Frank Herbert" },
          { title: "Dan Simmons", value: "Dan Simmons" },
        ],
      });
    });
    test("supports number", () => {
      const prompt = numberTransformer({
        __key: "reading_goal",
        __type: "number",
        type: "number",
        description: "How many books do you want to read this year?",
        // initial: 5,
      });

      expect(prompt).toStrictEqual({
        type: "number",
        name: "reading_goal",
        message: "How many books do you want to read this year?",
        // initial: 5,
      });
    });
    test("supports confirm / bool", () => {
      const prompt = confirmTransformer({
        __key: "publish",
        __type: "confirm",
        confirm: true,
        description: "Should we go ahead and publish this?",
      });

      expect(prompt).toStrictEqual({
        type: "confirm",
        name: "publish",
        message: "Should we go ahead and publish this?",
      });
    });
  });

  test.todo(
    "getPromptResponses returns correct object for scaffolding",
    async () => {
      // stub
      expect(1).toEqual(2);
    },
  );
});
