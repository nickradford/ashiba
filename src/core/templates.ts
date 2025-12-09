import { readdirSync } from "node:fs";
import { loadConfig } from "./config";

export interface TemplateMetadata {
  name: string;
  description?: string;
}

export async function listTemplates(): Promise<string[]> {
  // Resolve from project root (where .ashiba directory is)
  const projectRoot = import.meta.dir.split("src")[0];
  const ashibaDirPath = `${projectRoot}.ashiba`;
  
  try {
    const entries = readdirSync(ashibaDirPath);
    const templates: string[] = [];

    for (const entry of entries) {
      if (entry.endsWith(".toml")) {
        // Remove the .toml extension
        templates.push(entry.replace(/\.toml$/, ""));
      }
    }

    return templates.sort();
  } catch {
    return [];
  }
}

export async function loadTemplateMetadata(
  template: string,
): Promise<TemplateMetadata> {
  const config = await loadConfig(template);
  return {
    name: template,
    description: config.description,
  };
}
