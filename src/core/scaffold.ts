import pc from "picocolors";
import { readdir, stat } from "node:fs/promises";
import { type TemplateConfig } from "@core/config";
import path from "node:path";

type Values = {
  [key: string]: string;
};
export async function runScaffold(
  template: string,
  values: Values,
  outputDir: string,
) {
  const tmplDir = `.ashiba/${template}`;

  const paths = await readdir(tmplDir, { recursive: true });

  for (const filePath of paths) {
    const inPath = path.join(tmplDir, filePath);
    const outPath = path.join(outputDir, tryReplaceString(filePath, values));

    const s = await stat(inPath);

    if (s.isFile()) {
      const inFile = Bun.file(inPath);
      const outFile = Bun.file(outPath);
      const inText = await inFile.text();

      await outFile.write(tryReplaceString(inText, values));
      if (Bun.env.NODE_ENV !== "test") {
        console.log(`Wrote: ${pc.blue(outPath)}`);
      }
    }
  }
}

function tryReplaceString(original: string, values: Values) {
  const result = original.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
  return result;
}
