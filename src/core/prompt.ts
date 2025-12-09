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

    switch (field.__type) {
      case "string":
        return textTransformer(field);
      case "number":
        return numberTransformer(field);
      case "select":
        return selectTransformer(field);
      case "confirm":
        return confirmTransformer(field);
    }
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
