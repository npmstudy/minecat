#!/usr/bin/env node

import fs from "node:fs";
import { homedir } from "node:os";

// import shell from "shelljs";
export function getSafeHome() {
  const home = homedir + `/.minecat`;
  // if (!shell.test("-d", home)) {
  //   shell.mkdir("-p", home);
  // }

  return home;
}

export function writeConfig(cfg) {
  const configFile = getConfigFile();

  try {
    fs.writeFileSync(configFile, JSON.stringify(cfg, null, 4));
  } catch (error) {
    console.dir(error);
  }
}

export function getConfigFile() {
  return getSafeHome() + `/config.json`;
}

export function getConfig() {
  const configFile = getConfigFile();
  // console.dir(configFile);
  try {
    return JSON.parse(fs.readFileSync(configFile).toString());
  } catch (error) {
    if (error.errno === -2) {
      // if config.json is not exist， write default config to it.
      writeConfig(defaultCfg);
      return defaultCfg;
    } else {
      throw error;
    }
  }
}

export const defaultCfg = {
  "Node.js": "https://github.com/npmstudy/your-node-v20-monoreopo-project",
  React: "https://github.com/npmstudy/your-vite-react-monoreopo-project",
  Vue: "https://github.com/npmstudy/your-vite-react-monoreopo-project",
};

// ensure home dir existed, if not exist, create.
getSafeHome();

try {
  const json = getConfig();
} catch (error) {
  console.dir(error);
}
