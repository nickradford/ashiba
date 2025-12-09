import pc from "picocolors";
import { type TemplateConfig } from "./config";

export async function runScaffold(
  template: string,
  config: TemplateConfig,
  outputDir: string,
) {
  console.log(pc.blue(`Faking it`));
  console.log(`Template: ${template}`);
  console.log(`OutDir: ${outputDir}`);
  console.log(`Config: ${JSON.stringify(config, null, 2)}`);
}
