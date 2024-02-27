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
import type { CliConfig } from "libargs";

async function main(argv) {
  const { cli } = await import("libargs");

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
