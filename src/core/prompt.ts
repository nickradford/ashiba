import type { TemplateConfig, TemplateField } from "./config";
import prompts from "prompts";

export async function getPromptResponses(config: TemplateConfig) {
  const questions = config.order.map((key) => {
    const field = config[key] as TemplateField;
    return {
      type: "text" as const,
      name: key,
      message: field?.description,
    };
  });

  const response = await prompts(questions);
  console.log(response);
  return response;
}
