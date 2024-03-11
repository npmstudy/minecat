import fs from "node:fs";
import path from "node:path";
import { join } from "desm";
import prompt from "prompts";
import shell from "shelljs";
import { describe, expect, it, vi } from "vitest";
import * as Run from "../../cmd/run-ext";

describe("cmd/run.ts", () => {
  it("should call getCurrentCmd return correct", async () => {
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

    const c = Run.getCurrentCmd(cmd);

    expect(c).toBe("dev");
  });

  it("should call runCmd ls return correct", async () => {
    const res = Run.runCmd("ls");
    console.dir("res run cmd");
    console.dir(res);
    expect(res.code).toBe(0);
  });

  it("should call shell.exit() when runCmd abc", async () => {
    const spy = vi.spyOn(shell, "exit");

    try {
      Run.runCmd("abc");
    } catch (error) {}

    expect(spy).toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it("should call getPrompt correct", async () => {
    const injected = ["dev", true];

    // 准备测试数据
    prompt.inject(injected);

    const response = await Run.getPrompt("dev", ["build", "dev"]);

    console.dir("getPrompt");
    console.dir(response);

    expect(response.script).toBe("dev");
  });

  it("should call getPrompt invalid", async () => {
    const injected = ["dev", true];

    const spy = vi.spyOn(console, "log");

    // 准备测试数据
    prompt.inject(injected);

    const response = await Run.getPrompt("dev1", ["build", "dev"]);

    expect(spy).toHaveBeenCalled();
    // console.dir("getPrompt");
    // console.dir(response);

    // expect(response["script"]).toBe("dev");
  });

  it("should call getProjectScriptsName() correct", async () => {
    const spy = vi
      .spyOn(process, "cwd")
      .mockReturnValue(join(import.meta.url, "./fixtures/run"));

    const pkg = {
      minecat: {
        type: "Node.js",
      },
      scripts: {
        build: "nx run-many -t build",
        "build:fast": "nx run-many -t build:fast",
        dev: "npm run build && nx run-many -t dev",
        test: "nx run-many -t test",
        "test:watch": "nx run-many -t test:watch",
      },
    };
    fs.mkdirSync(path.join(process.cwd()), { recursive: true });

    const file = path.join(process.cwd(), "/package.json");

    if (!fs.existsSync(file)) {
      fs.writeFileSync(path.join(file), JSON.stringify(pkg, null, 4));
    }

    // const spy = vi.spyOn(console, "dir");

    const { proj_type, proj_script_names } = Run.getProjectScriptsName();
    console.dir(proj_type);
    console.dir(proj_script_names);

    if (proj_type) expect(proj_type).toBe("Node.js");
    vi.restoreAllMocks();
  });
});
