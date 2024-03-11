import { describe, expect, it, vi } from "vitest";
import * as Run from "../../cmd/add";
import prompt from "prompts";
import fs from "node:fs";
import path from "node:path";
import { join } from "desm";

describe("cmd/run.ts", () => {
  it("should call console.dir() when minecat run dev", async () => {
    const spy = vi.spyOn(console, "dir");

    // const spy2 = vi.spyOn(Run, "getProjectScriptsName").mockReturnValue({
    //   // proj_type: "Node.js",
    //   proj_script_names: ["build", "dev"],
    // });

    // let cmd = {
    //   desc: "init a minecat project with pnpm.",
    //   file: "init",
    //   usage: "<project-name>",
    //   fnName: "init",
    //   name: "run",
    //   show: "minecat run",
    //   dir: "/Users/npmstudy/workspace/github/minecat/packages/minecat/src/cmd",
    //   input: { _: [] },
    //   help: () => {},
    // };

    // try {
    //   await Run.ada(cmd);
    // } catch (error) {
    //   console.dir(error);
    // }

    // expect(spy).toHaveBeenCalled();
  });
});
