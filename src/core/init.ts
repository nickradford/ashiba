import { $ } from "bun";
import { existsSync } from "node:fs";
import { join } from "node:path";
import pc from "picocolors";

export async function initialize(path: string) {
  const ashibaPath = join(path, ".ashiba");

  if (existsSync(ashibaPath)) {
    console.error(pc.red(`${ashibaPath} already exists.`));
    return;
  }

  // TODO: could link into a registry of templates here and install some?
  // For now, just create a basic demo.toml and associated files.
  console.log(pc.blue(`Constructing...`));

  const files = [
    ["demo.toml", demo_toml],
    ["demo/{name}.md", demo_md],
  ];

  for (const f of files) {
    const [fileName, contents] = f;
    const file = await Bun.write(join(ashibaPath, fileName!), contents!);
    console.log(pc.black(` • Wrote ${pc.green(fileName)}`));
  }
}

const demo_toml = `
description = "My first ashiba template"
order = ["name"]

[name]
description = "What's your name?"
`.trim();

const demo_md = `
Hello {name}, how are you today?
`.trim();

export async function showPostInitHelp() {
  console.log(pc.green("\nAshiba initialized!\n"));
  console.log(pc.black(`Try the demo template: ${pc.blue(`ashiba new demo`)}`));
}
