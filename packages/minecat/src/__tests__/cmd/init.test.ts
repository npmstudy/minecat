import { describe, expect, it, beforeAll, vi } from "vitest";
import {
  getGitInfo,
  mkdirPkgHome,
  getParams,
  cloneAndCp,
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

  it("should getGitInfo()", () => {
    const { userName, repoName } = getGitInfo(
      "https://github.com/npmstudy/your-node-v20-monoreopo-project"
    );

    expect(userName).toBe("npmstudy");
    expect(repoName).toBe("your-node-v20-monoreopo-project");
  });

  it("should mkdirPkgHome()", async () => {
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
