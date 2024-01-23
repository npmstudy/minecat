#!/usr/bin/env node

import fs from "node:fs";
import { homedir } from "os";

export const defaultCfg = {
  "Node.js": "https://github.com/npmstudy/your-node-v20-monoreopo-project",
  React: "https://github.com/npmstudy/your-vite-react-monoreopo-project",
  Vue: "https://github.com/npmstudy/your-vite-react-monoreopo-project",
};

const configFile = homedir + `/.minecat/config.json`;
try {
  JSON.parse(fs.readFileSync(configFile).toString());
  // console.dir(json);
} catch (error) {
  if (error.errno === -2) {
    // if config.json is not exist， write default config to it.
    writeConfig(defaultCfg);
  }
}

export async function writeConfig(cfg) {
  try {
    fs.writeFileSync(configFile, JSON.stringify(cfg, null, 4));
  } catch (error) {
    console.dir(error);
  }
}
