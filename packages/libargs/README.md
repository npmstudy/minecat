# libargs

a configurable cli tool.

## Install


```sh
$ npm i - S libargs
```

## Usage

```js
#!/usr/bin/env node

import { join } from "desm";

const { cli } = await import("libargs");

const cfg = {
  name: "mincat",
  desc: "headline",
  dir: join(import.meta.url, ".", "fixtures"),
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

const spy = vi.spyOn(console, "log");

let argv = [
  "/Users/npmstudy/.nvm/versions/node/v20.11.1/bin/node",
  "/Users/npmstudy/workspace/github/minecat/packages/libargs/src/test.ts",
  "add",
  "a=1",
  "b=2",
  "--verbose",
];
// argv = [];
await cli(cfg, argv);

```

write a file `cmd/ada.ts`

```js
export function ada(cmd) {
  // cmd.help();
  console.log(cmd);
  const flags = cmd.flags;
  console.dir(flags);
}
```

## Config

- [requied] name: "mincat",
- [requied] desc: "headline",
- [requied] dir: join(import.meta.url, ".", "cmd"),

### cmd

- [requied] desc: "'ada an integration.'",
- [optional] file: "aba",
- [optional] fnName: "ada",
- [optional] flags: {},
