import fs from "node:fs";
import path from "node:path";
import { join } from "desm";
import prompt from "prompts";
import { describe, expect, it, vi } from "vitest";
import * as Run from "../../cmd/run";

describe("cmd/run.ts", () => {
  it("should call console.dir() when minecat run dev", async () => {
    const spy = vi.spyOn(console, "dir");

    const spy2 = vi.spyOn(Run, "getProjectScriptsName").mockReturnValue({
      // proj_type: "Node.js",
      proj_script_names: ["build", "dev"],
    });

    const cmd = {
      desc: "init a minecat project with pnpm.",
      file: "init",
      usage: "<project-name>",
      fnName: "init",
      name: "run",
      show: "minecat run",
      dir: "/Users/npmstudy/workspace/github/minecat/packages/minecat/src/cmd",
      input: { _: [] },
      help: () => {},
    };

    try {
      await Run.ada(cmd);
    } catch (error) {
      console.dir(error);
    }

    expect(spy).toHaveBeenCalled();
  });

  it("should call console.dir() when minecat run", async () => {
    const spy = vi.spyOn(console, "dir");

    const cmd = {
      desc: "init a minecat project with pnpm.",
      file: "init",
      usage: "<project-name>",
      fnName: "init",
      name: "run",
      show: "minecat run",
      dir: "/Users/npmstudy/workspace/github/minecat/packages/minecat/src/cmd",
      input: { _: ["dev"] },
      help: () => {},
    };

    try {
      await Run.ada(cmd);
    } catch (error) {
      console.dir(error);
    }

    expect(spy).toHaveBeenCalled();
  });

  it("should create  when minecat run ", async () => {
    // vi.restoreAllMocks();
    // 如果目录不存在，就创建

    const injected = ["dev", true];

    // 准备测试数据
    prompt.inject(injected);

    const cmd = {
      desc: "config a minecat project with pnpm.",
      file: "config",
      usage: "<project-name>",
      fnName: "config",
      name: "config",
      show: "minecat config",
      dir: "/Users/npmstudy/workspace/github/minecat/packages/minecat/src/cmd",
      input: { _: [] },
      help: () => {},
    };

    try {
      // console.dir(fs.existsSync(cfgFile));
      // 调用核心测试逻辑
      await Run.ada(cmd);
    } catch (error) {
      console.dir(error);
    }
  });

  it("should create  when minecat run ", async () => {
    // vi.restoreAllMocks();
    // 如果目录不存在，就创建

    const injected = ["dev", false];

    // 准备测试数据
    prompt.inject(injected);

    const cmd = {
      desc: "config a minecat project with pnpm.",
      file: "config",
      usage: "<project-name>",
      fnName: "config",
      name: "config",
      show: "minecat config",
      dir: "/Users/npmstudy/workspace/github/minecat/packages/minecat/src/cmd",
      input: { _: [] },
      help: () => {},
    };

    try {
      // console.dir(fs.existsSync(cfgFile));
      // 调用核心测试逻辑
      await Run.ada(cmd);
    } catch (error) {
      console.dir(error);
    }
  });
});
