import { cli, z } from "zlye";
import pkg from "../../package.json";
import { loadConfig } from "../core/config";
import { runScaffold } from "../core/scaffold";

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
    console.log("CONFIG", config);
    console.log(options);
    await runScaffold(template, config, options.outDir);
  });

ashiba.parse();
