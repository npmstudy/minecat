#!/usr/bin/env node

import { join } from "desm";
import type { CliConfig } from "./src/index";

async function main(argv) {
  const { cli } = await import("./src/index");

  const cfg: CliConfig = {
    name: "mincat",
    desc: "headline",
    dir: join(import.meta.url, "./src/__tests__/", "fixtures"),
    commands: {
      add: {
        desc: "'Add an integration.'",
        fnName: "ada",
        flags: {
          "--config <path>": "Specify your config file.",
          "--root <path>": "Specify your project root folder.",
        },
      },
      init: {
        desc: "'init an integration.'",
        flags: {
          "--config1 <path>": "Specify your config file.",
          "--root1 <path>": "Specify your project root folder.",
        },
      },
      ada: {
        desc: "'ada an integration.'",
        file: "aba",
        fnName: "ada",
        flags: {
          "--config1 <path>": "Specify your config file.",
          "--root1 <path>": "Specify your project root folder.",
        },
      },
    },
    flags: {
      "--config <path>": "Specify your config file.",
      "--root <path>": "Specify your project root folder.",
      "--site <url>": "Specify your project site.",
    },
  };

  // argv = [];
  await cli(cfg, argv);
}

main(process.argv);
