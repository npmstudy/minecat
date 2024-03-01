import { describe, expect, it, vi } from "vitest";

import { printHelp } from "../util";

describe("lib", () => {
  it("should call conosle.log 1 time when call printHelp", () => {
    const spy = vi.spyOn(console, "log");

    printHelp({
      version: null,
      commandName: "minecat sync",
      usage: "[...flags]",
      tables: {
        Flags: [["--help (-h)", "See all available flags."]],
      },
      description: `Generates TypeScript types for all Minecat modules.`,
    });
    // expect("lib").toBe("lib");
    // console.dir("2323");
    expect(spy).toHaveBeenCalled();
  });
});
