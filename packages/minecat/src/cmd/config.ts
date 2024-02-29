import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { getSafeHomeDir } from "./dir";
import type { MinecatConfig } from "../types/minecat-config";
import path from "node:path";

export const DEFAULT_CONFIGS: MinecatConfig = {
  "Node.js": "https://github.com/npmstudy/your-node-v20-monoreopo-project",
  React: "https://github.com/npmstudy/your-vite-react-monoreopo-project",
  Vue: "https://github.com/npmstudy/your-vite-react-monoreopo-project",
};

export function getConfigFile(): string {
  return path.join(getSafeHomeDir(), `/config.json`);
}

export function getConfig() {
  const configFile = getConfigFile();

  try {
    if (existsSync(configFile)) {
      return JSON.parse(readFileSync(configFile).toString());
    } else {
      writeConfig(DEFAULT_CONFIGS);
      return DEFAULT_CONFIGS;
    }
  } catch (error) {
    throw error;
  }
}

export async function writeConfig(cfg) {
  const configFile = getConfigFile();

  try {
    writeFileSync(configFile, JSON.stringify(cfg, null, 4));
  } catch (error) {
    console.dir(error);
  }
}
