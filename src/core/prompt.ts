import {
  ConfirmField,
  NumberField,
  SelectField,
  type TemplateConfig,
  TemplateField,
  TextField,
} from "./config";
import prompts, { type PromptObject } from "prompts";

export function getPromptQuestionsFromConfig(
  config: TemplateConfig,
): prompts.PromptObject[] {
  const questions = config.order.map((key) => {
    const field = config[key] as TemplateField;

    let promptStep: PromptObject;

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

    console.log({ field, promptStep });
    return promptStep;
  });

  return questions;
}

export async function getPromptResponses(config: TemplateConfig) {
  const questions = getPromptQuestionsFromConfig(config);
  const response = await prompts(questions);
  return response;
}

export function textTransformer(field: TextField): PromptObject {
  return {
    type: "text",
    name: field.__key,
    message: field.description,
  };
}

export function numberTransformer(field: NumberField): PromptObject {
  return {
    type: "number",
    name: field.__key,
    message: field.description,
    initial: field.initial,
    increment: 1,
    min: 0,
  };
}

export function selectTransformer(field: SelectField): PromptObject {
  return {
    type: "select",
    name: field.__key,
    message: field.description,
    choices: field.select.map((f) => ({ title: f, value: f })),
  };
}

export function confirmTransformer(field: ConfirmField): PromptObject {
  return {
    type: "confirm",
    name: field.__key,
    message: field.description,
  };
}
