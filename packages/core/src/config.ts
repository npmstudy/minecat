import { join } from "desm";

export const config = {
  name: "mincat",
  desc: "a monorepo cli tool for Node.js、React",
  dir: join(import.meta.url, ".", "cmd"),
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
