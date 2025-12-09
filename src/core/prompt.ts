import { input, select, confirm } from "@inquirer/prompts";
import numberWheel from "./components/number-wheel";
import {
  ConfirmField,
  NumberField,
  SelectField,
  type TemplateConfig,
  TemplateField,
  TextField,
} from "./config";

export type Question =
  | TextQuestion
  | NumberQuestion
  | SelectQuestion
  | ConfirmQuestion;

export interface BaseQuestion {
  type: string;
  name: string;
  message: string;
}

export interface TextQuestion extends BaseQuestion {
  type: "text";
}

export interface NumberQuestion extends BaseQuestion {
  type: "number";
  default?: number;
  min?: number;
  max?: number;
  interval?: number;
}

export interface SelectQuestion extends BaseQuestion {
  type: "select";
  choices: Array<{ title: string; value: string }>;
}

export interface ConfirmQuestion extends BaseQuestion {
  type: "confirm";
}

/**
 * Abstraction layer for prompting users
 * This allows switching between prompt libraries without changing consumers
 */
export async function promptUser(
  questions: Question[],
): Promise<Record<string, any>> {
  const answers: Record<string, any> = {};

  for (const question of questions) {
    let answer: any;

    switch (question.type) {
      case "text":
        answer = await input({
          message: question.message,
        });
        break;
      case "number":
        answer = await numberWheel({
          message: question.message,
          ...(question.default !== undefined && { default: question.default }),
          ...(question.min !== undefined && { min: question.min }),
          ...(question.max !== undefined && { max: question.max }),
          ...(question.interval !== undefined && { interval: question.interval }),
        });
        break;
      case "select":
        answer = await select({
          message: question.message,
          choices: question.choices,
        });
        break;
      case "confirm":
        answer = await confirm({
          message: question.message,
        });
        break;
    }

    answers[question.name] = answer;
  }

  return answers;
}

export function getPromptQuestionsFromConfig(
  config: TemplateConfig,
): Question[] {
  const questions = config.order.map((key) => {
    const field = config[key] as TemplateField;

    let promptStep: Question;

    switch (field.__type) {
      case "string":
        promptStep = textTransformer(field);
        break;
      case "number":
        promptStep = numberTransformer(field);
        break;
      case "select":
        promptStep = selectTransformer(field);
        break;
      case "confirm":
        promptStep = confirmTransformer(field);
    }

    return promptStep;
  });

  return questions;
}

export async function getPromptResponses(config: TemplateConfig) {
  const questions = getPromptQuestionsFromConfig(config);
  const response = await promptUser(questions);
  return response;
}

export function textTransformer(field: TextField): TextQuestion {
  return {
    type: "text",
    name: field.__key as string,
    message: field.description ?? "",
  };
}

export function numberTransformer(field: NumberField): NumberQuestion {
  const question: NumberQuestion = {
    type: "number",
    name: field.__key as string,
    message: field.description ?? "",
  };

  if (field.default !== undefined) {
    question.default = field.default;
  }

  if (field.min !== undefined) {
    question.min = field.min;
  }

  if (field.max !== undefined) {
    question.max = field.max;
  }

  if (field.interval !== undefined) {
    question.interval = field.interval;
  }

  return question;
}

export function selectTransformer(field: SelectField): SelectQuestion {
  return {
    type: "select",
    name: field.__key as string,
    message: field.description ?? "",
    choices: field.select.map((f) => ({ title: f, value: f })),
  };
}

export function confirmTransformer(field: ConfirmField): ConfirmQuestion {
  return {
    type: "confirm",
    name: field.__key as string,
    message: field.description ?? "",
  };
}
