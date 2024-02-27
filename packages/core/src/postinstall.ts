#!/usr/bin/env node

// import shell from "shelljs";
import { writeConfig, getConfig, getSafeHome } from "./util";

export const defaultCfg = {
  "Node.js": "https://github.com/npmstudy/your-node-v20-monoreopo-project",
  React: "https://github.com/npmstudy/your-vite-react-monoreopo-project",
  Vue: "https://github.com/npmstudy/your-vite-react-monoreopo-project",
};

// ensure home dir existed, if not exist, create.
getSafeHome();

try {
  const json = getConfig();
  // console.dir(json);
} catch (error) {
  console.dir(error);
}
