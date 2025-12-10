import { Command } from "commander";
import pkg from "../../package.json";
import { registerNewCommand, registerListCommand } from "@cli/commands";

export function createProgram(): Command {
  const program = new Command()
    .name(pkg.name)
    .description(pkg.description)
    .version(pkg.version);

  // Register all commands
  registerNewCommand(program);
  registerListCommand(program);

  return program;
}

// Entry point
if (import.meta.main) {
  const program = createProgram();
  program.parse(process.argv);
}
