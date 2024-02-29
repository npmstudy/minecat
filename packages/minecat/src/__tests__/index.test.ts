import { describe, expect, it, vi } from "vitest";
import * as Index from "../index";

import * as libargs from "libargs";

describe("index", () => {
  it("should call libargs.cli()", () => {
    const spy = vi.spyOn(libargs, "cli");

    Index.main([]);

    expect(spy).toHaveBeenCalled();
  });
});
