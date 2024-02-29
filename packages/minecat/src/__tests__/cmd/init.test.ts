import { describe, expect, it, beforeAll } from "vitest";
import { getGitInfo, mkdirPkgHome } from "../../cmd/init";
import fs from "node:fs";
import { homedir } from "node:os";

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
    const pkgHome = homedir + `/.minecat/` + promptInput.apptype + "/";

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
});
