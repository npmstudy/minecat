import { readFileSync, writeFileSync } from "node:fs";
import { getSafeHome } from "./dir";

export const DEFAULT_CONFIGS = {
  "Node.js": "https://github.com/npmstudy/your-node-v20-monoreopo-project",
  React: "https://github.com/npmstudy/your-vite-react-monoreopo-project",
  Vue: "https://github.com/npmstudy/your-vite-react-monoreopo-project",
};

export function getConfigFile(): string {
  return getSafeHome() + `/config.json`;
}

export function getConfig() {
  const configFile = getConfigFile();
  // console.dir(configFile);
  try {
    return JSON.parse(readFileSync(configFile).toString());
  } catch (error) {
    if (error.errno === -2) {
      // if config.json is not exist， write default config to it.
      writeConfig(DEFAULT_CONFIGS);
      return DEFAULT_CONFIGS;
    } else {
      throw error;
    }
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
