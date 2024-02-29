import { describe, expect, it, vi } from "vitest";
import * as Index from "../index";

import * as libargs from "libargs";

describe("index", () => {
  // it("prompts for the project name if none supplied", () => {
  //   const { stdout } = run([]);
  //   console.dir(stdout);
  //   // expect(stdout).toContain("please check this is a minecat project");
  // });

  it("should call libargs.cli()", () => {
    const spy = vi.spyOn(libargs, "cli");

    Index.main([]);

    expect(spy).toHaveBeenCalled();
  });
});
