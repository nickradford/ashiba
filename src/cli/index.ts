import { cli, z } from "zlye";
import pc from "picocolors";
import pkg from "../../package.json";
import { loadConfig } from "../core/config";
import { runScaffold } from "../core/scaffold";
import { getPromptResponses } from "../core/prompt";
import { listTemplates, loadTemplateMetadata } from "../core/templates";

const ashiba = cli()
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version);

/**
 *
 */

ashiba
  .command("new", {
    outDir: z
      .string()
      .alias("o")
      .describe("The target directory for the newly scaffolded item"),
  })
  .description("Scaffold a new <template>")
  .positional("template", z.string())
  .action(async ({ options, positionals }) => {
    const template = positionals[0];
    const config = await loadConfig(template);
    const responses = await getPromptResponses(config);
    await runScaffold(template, responses, options.outDir);
  });

ashiba
  .command("list")
  .description("List all available templates")
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
        // If metadata can't be loaded, just show the name
        console.log(`  ${pc.green("•")} ${template}`);
      }
    }
  });

ashiba.parse();
