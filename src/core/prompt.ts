import type { TemplateConfig } from "./config";
import prompts from "prompts";

export async function getPromptResponses(config: TemplateConfig) {
  const questions = config.order.map((key) => ({
    type: "text",
    name: key,
    message: config[key]?.description,
  }));

  const response = await prompts(questions);
  console.log(response);
  return response;
}
