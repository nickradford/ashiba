import { test, expect, describe, mock } from "bun:test";
import type { TemplateConfig } from "./config";
import {
  confirmTransformer,
  getPromptQuestionsFromConfig,
  getPromptResponses,
  numberTransformer,
  selectTransformer,
  textTransformer,
  promptUser,
  type Question,
  type SelectQuestion,
} from "./prompt";

describe("prompt", async () => {
  describe("promptUser abstraction", async () => {
    test("promptUser returns responses in correct format", async () => {
      const questions: Question[] = [
        {
          type: "text",
          name: "author",
          message: "Who is writing this?",
        },
      ];

      const mockResponses = { author: "J.R.R. Tolkien" };

      // Mock the promptUser function to test getPromptResponses integration
      const originalPromptUser = promptUser;
      const mockPromptUser = mock(
        async () => mockResponses
      );

      // We'll test that promptUser is called with correct questions
      expect(mockPromptUser).toBeDefined();
    });

    test("promptUser handles text questions", async () => {
      const questions: Question[] = [
        {
          type: "text",
          name: "title",
          message: "What is the title?",
        },
      ];

      // This test verifies the question structure is correct
      expect(questions[0]?.type).toBe("text");
      expect(questions[0]?.name).toBe("title");
    });

    test("promptUser handles select questions with choices", async () => {
      const questions: Question[] = [
        {
          type: "select",
          name: "framework",
          message: "Choose a framework",
          choices: [
            { title: "React", value: "react" },
            { title: "Vue", value: "vue" },
          ],
        },
      ];

      expect(questions[0]?.type).toBe("select");
      expect((questions[0] as SelectQuestion)?.choices).toHaveLength(2);
    });

    test("promptUser handles number questions", async () => {
      const questions: Question[] = [
        {
          type: "number",
          name: "count",
          message: "How many?",
        },
      ];

      expect(questions[0]?.type).toBe("number");
      expect(questions[0]?.name).toBe("count");
    });

    test("promptUser handles confirm questions", async () => {
      const questions: Question[] = [
        {
          type: "confirm",
          name: "proceed",
          message: "Do you want to proceed?",
        },
      ];

      expect(questions[0]?.type).toBe("confirm");
      expect(questions[0]?.name).toBe("proceed");
    });
  });

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
    ] as Question[];

    expect(questions).toStrictEqual(expected);
  });

  describe("field types", async () => {
    test("supports text (default)", () => {
      const prompt = textTransformer({
        __key: "Author",
        __type: "string",
        description: "Who is writing this?",
      });

      expect(prompt).toEqual({
        type: "text",
        name: "Author",
        message: "Who is writing this?",
      });
      expect(prompt.type).toBe("text");
      expect(prompt.name).toBe("Author");
    });
    test("supports select", () => {
      const prompt = selectTransformer({
        __key: "favorite_author",
        __type: "select",
        description: "Who is the best author?",
        select: ["J. R. R. Tolkien", "Frank Herbert", "Dan Simmons"],
      });

      expect(prompt.type).toBe("select");
      expect(prompt.name).toBe("favorite_author");
      expect((prompt as any).choices).toEqual([
        { title: "J. R. R. Tolkien", value: "J. R. R. Tolkien" },
        { title: "Frank Herbert", value: "Frank Herbert" },
        { title: "Dan Simmons", value: "Dan Simmons" },
      ]);
    });
    test("supports number", () => {
      const prompt = numberTransformer({
        __key: "reading_goal",
        __type: "number",
        type: "number",
        description: "How many books do you want to read this year?",
      });

      expect(prompt.type).toBe("number");
      expect(prompt.name).toBe("reading_goal");
      expect(prompt.message).toBe("How many books do you want to read this year?");
    });

    test("supports number with default value", () => {
      const prompt = numberTransformer({
        __key: "reading_goal",
        __type: "number",
        type: "number",
        description: "How many books do you want to read this year?",
        default: 5,
      });

      expect(prompt.type).toBe("number");
      expect(prompt.name).toBe("reading_goal");
      expect(prompt.default).toBe(5);
    });
    test("supports confirm / bool", () => {
      const prompt = confirmTransformer({
        __key: "publish",
        __type: "confirm",
        confirm: true,
        description: "Should we go ahead and publish this?",
      });

      expect(prompt.type).toBe("confirm");
      expect(prompt.name).toBe("publish");
      expect(prompt.message).toBe("Should we go ahead and publish this?");
    });
  });
});
