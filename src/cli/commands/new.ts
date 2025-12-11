import { Command } from "commander";
import { loadConfig } from "@core/config";
import { getPromptResponses } from "@core/prompt";
import { runScaffold } from "@core/scaffold";

export function registerNewCommand(program: Command): void {
  program
    .command("new <template> <outDirectory>")
    .description("Scaffold a new <template> in <outDirectory>")
    .action(async (template: string, outDir: string) => {
      const config = await loadConfig(template);
      const responses = await getPromptResponses(config);
      await runScaffold(template, responses, outDir);
    });
}
