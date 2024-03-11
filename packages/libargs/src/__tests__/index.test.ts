import { join } from "desm";
import { describe, expect, it, vi } from "vitest";
import type { CliConfig } from "../index";

describe("lib", () => {
  it("should render lib", () => {
    expect("lib").toBe("lib");
  });

  it("should run cli ok", async () => {
    const { cli } = await import("../index.js");

    const cfg: CliConfig = {
      name: "minecat",
      desc: "headline",
      dir: join(import.meta.url, ".", "fixtures"),
      commands: {
        add: {
          desc: "'Add an integration.'",
          fnName: "ada",
          alias: "a",
          flags: {
            "--config <path>": "Specify your config file.",
            "--root <path>": "Specify your project root folder.",
          },
        },
        init: {
          desc: "'init an integration.'",
          alias: "i",
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

    const argv = [
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

  it("should command alias work", async () => {
    const { cli } = await import("../index.js");

    const cfg: CliConfig = {
      name: "minecat",
      desc: "headline",
      dir: join(import.meta.url, ".", "fixtures"),
      commands: {
        add: {
          desc: "'Add an integration.'",
          fnName: "ada",
          alias: "a",
          flags: {
            "--config <path>": "Specify your config file.",
            "--root <path>": "Specify your project root folder.",
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

    const argv = [
      "/Users/npmstudy/.nvm/versions/node/v20.11.1/bin/node",
      "/Users/npmstudy/workspace/github/minecat/packages/libargs/src/test.ts",
      "a",
      "a=1",
      "b=2",
      "--verbose",
    ];
    await cli(cfg, argv);

    expect(spy).toHaveBeenCalled();
  });
});
