import { describe, expect, it, beforeAll, vi } from "vitest";
import shell from "shelljs";
import {
  getGitInfo,
  mkdirPkgHome,
  getParams,
  getOriginPkgDir,
  movePkgToCache,
  resetGitInfo,
  cloneAndCp,
  init,
} from "../../cmd/init";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import prompt from "prompts";
import { join } from "desm";

describe("cmd/init", () => {
  beforeAll(function () {
    // console.dir("beforeAll");
  });

  it(
    "should cli()",
    async () => {
      const spy = vi
        .spyOn(process, "cwd")
        .mockReturnValue(join(import.meta.url, "../../.."));

      const spy2 = vi
        .spyOn(os, "homedir")
        .mockReturnValue(join(import.meta.url, "__mocks__"));

      const spy3 = vi.spyOn(console, "log");

      const apptype = "Node.js";
      const newname = "yourproject";
      const confirm = true;

      const injected = [apptype, newname, confirm];
      prompt.inject(injected);

      // const spy = vi.spyOn(libargs, "cli");
      let cmd = {
        desc: "init a minecat project with pnpm.",
        file: "init",
        usage: "<project-name>",
        fnName: "init",
        name: "init",
        show: "minecat init",
        dir: "/Users/npmstudy/workspace/github/minecat/packages/minecat/src/cmd",
        input: { _: [] },
        help: () => {},
      };

      await init(cmd);

      expect(spy3).toHaveBeenCalled();
      // expect(spy).toHaveBeenCalled();

      vi.restoreAllMocks();
    },
    { timeout: 100000 }
  );

  it("should resetGitInfo ()", () => {
    const promptInput = {
      apptype: "Node.js",
      newname: "yourproject",
      confirm: true,
    };
    const spy = vi.spyOn(process, "cwd").mockReturnValue(os.homedir());

    const cloneToLocalDir = path.join(process.cwd(), promptInput.newname);

    if (fs.existsSync(cloneToLocalDir))
      fs.rmdirSync(cloneToLocalDir, { recursive: true });

    if (!fs.existsSync(cloneToLocalDir)) {
      fs.mkdirSync(cloneToLocalDir, { recursive: true });
    }

    // console.dir("text");
    const result = shell.exec(
      `cd ${cloneToLocalDir} && git init && git remote add origin git@github.com:npmstudy/minecat.git`
    );

    // console.dir(result);

    if (result.code === 0) {
      // 完成了准备操作
      const gitconfig = path.join(cloneToLocalDir, "./.git/config");

      const text2 = fs.readFileSync(gitconfig).toString();
      // console.dir("text22");
      // console.dir(text2);

      expect(text2.indexOf("minecat") > 0).toBe(true);

      resetGitInfo(promptInput);

      const text = fs.readFileSync(gitconfig).toString();
      // console.dir("text");
      // console.dir(text);
      expect(text.indexOf("minecat") > 0).toBe(false);

      fs.rmdirSync(cloneToLocalDir, { recursive: true });
    } else {
      console.dir(result);
    }

    // const repoName = "your-node-v20-monoreopo-project";

    // expect(originPkgDir).toBe(path.join(process.cwd(), repoName, "packages"));
  });

  it("should movePkgToCache()", () => {
    const promptInput = {
      apptype: "Node.js",
      newname: "yourproject",
      confirm: true,
    };

    const spy2 = vi
      .spyOn(os, "homedir")
      .mockReturnValue(join(import.meta.url, "sss"));

    const dir = path.join(os.homedir(), "./.minecat/Node.js");
    if (!fs.existsSync(os.homedir())) {
      fs.mkdirSync(dir, { recursive: true });
      // fs.writeFileSync(path.join(dir, "./abc"), "tpl");
    }

    const spy = vi
      .spyOn(process, "cwd")
      .mockReturnValue(join(import.meta.url, "./fixtures"));
    // console.dir("process.cwd()");
    // console.dir(process.cwd());
    // mv pkg to ~/.minecat/Node.js/xxx
    movePkgToCache(promptInput);

    // console.dir(path.join(dir, "./lib"));

    expect(fs.existsSync(path.join(dir, "./lib"))).toBe(true);
    expect(fs.existsSync(path.join(dir, "./lib2"))).toBe(true);

    if (!fs.existsSync(os.homedir())) {
      fs.rmdirSync(os.homedir(), { recursive: true });
      // fs.writeFileSync(path.join(dir, "./abc"), "tpl");
    }
  });

  it("should getOriginPkgDir()", () => {
    const spy = vi
      .spyOn(process, "cwd")
      .mockReturnValue(join(import.meta.url, "../../.."));

    const repoName = "your-node-v20-monoreopo-project";

    const originPkgDir = getOriginPkgDir(
      "https://github.com/npmstudy/your-node-v20-monoreopo-project"
    );

    expect(originPkgDir).toBe(path.join(process.cwd(), repoName, "packages"));
  });

  it("should getGitInfo()", () => {
    const { userName, repoName } = getGitInfo(
      "https://github.com/npmstudy/your-node-v20-monoreopo-project"
    );

    expect(userName).toBe("npmstudy");
    expect(repoName).toBe("your-node-v20-monoreopo-project");
  });

  it("should mkdirPkgHome()", async () => {
    vi.restoreAllMocks();

    const promptInput = { apptype: "Node.js" };
    // 如果目录存在，就删掉
    const pkgHome = os.homedir + `/.minecat/` + promptInput.apptype + "/";

    if (fs.existsSync(pkgHome) === true) {
      fs.rmdirSync(pkgHome, { recursive: true });
    }

    // 确保pkgHome不存在
    const isExist = fs.existsSync(pkgHome);
    expect(isExist).toBe(false);

    // 执行mkdirPkgHome方法
    if (isExist === false) {
      mkdirPkgHome(promptInput);
      const isExistAfterCreated = fs.existsSync(pkgHome);
      expect(isExistAfterCreated).toBe(true);
    }
  });

  it("should getParams()", async () => {
    const { userName, repoName } = getGitInfo(
      "https://github.com/npmstudy/your-node-v20-monoreopo-project"
    );

    const apptype = "Node.js";
    const newname = "yourproject";
    const confirm = true;

    const injected = [apptype, newname, confirm];
    prompt.inject(injected);

    const { url, promptInput } = await getParams("yourproject");

    // console.dir("url---");
    // console.dir(url);
    // console.dir(promptInput);

    expect(url).toBe(
      "https://github.com/npmstudy/your-node-v20-monoreopo-project"
    );
    expect(promptInput.apptype).toBe(apptype);
    expect(promptInput.newname).toBe(newname);
    expect(promptInput.confirm).toBe(confirm);
  });

  it(
    "should cloneAndCp()",
    async () => {
      const spy = vi
        .spyOn(process, "cwd")
        .mockReturnValue(join(import.meta.url, "../../.."));

      const spy2 = vi
        .spyOn(os, "homedir")
        .mockReturnValue(join(import.meta.url, "__mocks__"));

      const promptInput = {
        apptype: "Node.js",
        newname: "yourproject",
        confirm: true,
      };
      const url = "https://github.com/npmstudy/your-node-v20-monoreopo-project";

      const { userName, repoName } = getGitInfo(
        "https://github.com/npmstudy/your-node-v20-monoreopo-project"
      );

      const pkgHome = path.join(
        os.homedir(),
        ".minecat",
        promptInput.apptype,
        "/"
      );

      // 如果目录不存在，就创建
      if (fs.existsSync(pkgHome) === false) {
        fs.mkdirSync(pkgHome, { recursive: true });
      }

      await cloneAndCp(promptInput, url);

      expect(
        fs.existsSync(path.join(pkgHome, "./your-node-v20-monoreopo-project"))
      ).toBe(true);

      // 从your-node-v20-monoreopo-project 被rename为yourproject
      const newname = path.join(process.cwd(), "./" + promptInput.newname);

      expect(fs.existsSync(newname)).toBe(true);

      // 清理测试数据
      if (fs.existsSync(newname) === true) {
        fs.rmdirSync(newname, { recursive: true });
      }

      if (fs.existsSync(os.homedir()) === true) {
        fs.rmdirSync(os.homedir(), { recursive: true });
      }
    },
    { timeout: 100000 }
  );
});
