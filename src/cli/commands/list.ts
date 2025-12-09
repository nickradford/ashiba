import { Command } from "commander";
import pc from "picocolors";
import { listTemplates, loadTemplateMetadata } from "@core/templates";

export function registerListCommand(program: Command): void {
  program
    .command("list")
    .description("List all available templates")
    .option("-v", "--verbose")
    .action(async () => {
      const templates = await listTemplates();
      if (templates.length === 0) {
        console.log(pc.yellow("No templates found in .ashiba directory"));
        process.exit(0);
      }
      console.log(pc.cyan("Available templates:"));
      for (const template of templates) {
        try {
          const metadata = await loadTemplateMetadata(template);
          const desc = metadata.description
            ? ` ${pc.gray(`- ${metadata.description}`)}`
            : "";
          console.log(`  ${pc.green("•")} ${template}${desc}`);
        } catch {
          console.log(`  ${pc.green("•")} ${template}`);
        }
      }
    });
}
