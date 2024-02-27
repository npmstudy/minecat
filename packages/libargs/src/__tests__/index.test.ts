import { describe, expect, it, vi } from "vitest";
import { join } from "desm";

describe("lib", () => {
  it("should render lib", () => {
    expect("lib").toBe("lib");
  });

  it.only("should render lib", async () => {
    const { cli } = await import("../index.js");

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

    // expect("lib").toBe("lib");
    expect(spy).toHaveBeenCalled();
  });
});
