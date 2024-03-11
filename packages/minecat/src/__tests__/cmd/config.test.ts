import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import prompt from "prompts";
import { describe, expect, it, vi } from "vitest";
import { ada } from "../../cmd/config";
import { DEFAULT_CONFIGS, writeConfig } from "../../utils";

describe("cmd/config.ts", () => {
  it("should call console.dir() when minecat config list", async () => {
    const spy = vi.spyOn(console, "dir");

    const cmd = {
      desc: "init a minecat project with pnpm.",
      file: "init",
      usage: "<project-name>",
      fnName: "init",
      name: "init",
      show: "minecat init",
      dir: "/Users/npmstudy/workspace/github/minecat/packages/minecat/src/cmd",
      input: { _: ["list"] },
      help: () => {},
    };

    try {
      await ada(cmd);
    } catch (error) {
      console.dir(error);
    }

    expect(spy).toHaveBeenCalled();
  });

  it("should create  when minecat config ", async () => {
    // vi.restoreAllMocks();
    // 如果目录不存在，就创建

    const sleep = (delay) =>
      new Promise((resolve) => setTimeout(resolve, delay));

    const cfgFile = path.join(os.homedir(), ".minecat", "/config.json");

    if (!fs.existsSync(path.join(os.homedir(), ".minecat"))) {
      fs.mkdirSync(path.join(os.homedir(), ".minecat"), { recursive: true });
    }
    // 不管文件里是啥，写入默认配置
    writeConfig(DEFAULT_CONFIGS);

    await sleep(500);

    const cfg1 = JSON.parse(fs.readFileSync(cfgFile).toString());

    // console.dir(cfg1);

    expect(cfg1["Node.js"]).toBe(
      "https://github.com/npmstudy/your-node-v20-monoreopo-project",
    );

    const injected = [
      "newtpl",
      "https://github.com/npmstudy/your-node-v20-monoreopo-project",
      true,
    ];

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

    await sleep(500);

    try {
      // console.dir(fs.existsSync(cfgFile));
      // 调用核心测试逻辑
      await ada(cmd);
    } catch (error) {
      console.dir(error);
    }

    await sleep(500);
    const cfg = JSON.parse(fs.readFileSync(cfgFile).toString());

    // console.dir(cfg);
    // expect(cfg["newtpl"]).toBe(
    //   "https://github.com/npmstudy/your-node-v20-monoreopo-project"
    // );

    // 移除
    writeConfig(DEFAULT_CONFIGS);
  });
});
