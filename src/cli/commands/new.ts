import { Command } from 'commander';
import { loadConfig } from '@core/config';
import { getPromptResponses } from '@core/prompt';
import { runScaffold } from '@core/scaffold';

export function registerNewCommand(program: Command): void {
  program
    .command('new <template>')
    .description('Scaffold a new <template>')
    .option('-o, --outDir <dir>', 'The target directory for the newly scaffolded item')
    .action(async (template: string, options: { outDir?: string }) => {
      const config = await loadConfig(template);
      const responses = await getPromptResponses(config);
      await runScaffold(template, responses, options.outDir);
    });
}
