import { initialize, showPostInitHelp } from "@/core/init";
import { Command } from "commander";
import pc from "picocolors";

export function registerInitCommand(program: Command) {
  program
    .command("init")
    .description("Initialize ashiba in the current directory")
    .action(async () => {
      await initialize(process.cwd());
      showPostInitHelp();
    });
}
