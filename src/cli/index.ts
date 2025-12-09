import { cli, z } from "zlye";
import pkg from "../../package.json";
import { loadConfig } from "../core/config";
import { runScaffold } from "../core/scaffold";
import { getPromptResponses } from "../core/prompt";

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

ashiba.parse();
