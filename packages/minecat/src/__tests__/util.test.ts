import { describe, expect, it, vi } from "vitest";

import { join } from "node:path";
import {
  getDirectories,
  extractGitHubRepoInfo,
  getSafeHome,
  getConfig,
  defaultCfg,
  getConfigFile,
} from "../util";
import { homedir } from "node:os";
import fs from "node:fs";

const CLI_PATH = join(__dirname, "../../dist/");

describe("util", () => {
  it("should getDirectories /packages/* return 2（minecat & libargs）", () => {
    const pkgs = getDirectories("../../packages/");
    expect(pkgs.length).toBe(2);
  });

  it("should extractGitHubRepoInfo a git repo return username and reponame", () => {
    const { owner, name } = extractGitHubRepoInfo(
      "https://github.com/npmstudy/your-node-v20-monoreopo-project"
    );
    expect(owner).toBe("npmstudy");
    expect(name).toBe("your-node-v20-monoreopo-project");
  });

  it("should getSafeHome return ~/.minecat", () => {
    const home = homedir + `/.minecat`;
    if (fs.existsSync(home)) {
      fs.rmdirSync(home, { recursive: true });
    }

    expect(fs.existsSync(home)).toBe(false);
    const spy = vi.spyOn(fs, "mkdirSync");
    const dir = getSafeHome();

    expect(spy).toHaveBeenCalled();
    expect(dir).toBe(home);

    const cfg = getConfig();
    expect(cfg["Node.js"]).toBe(defaultCfg["Node.js"]);
  });

  it("should getConfigFile return ~/.minecat/config.json", () => {
    const configFile = homedir + `/.minecat/config.json`;

    const file = getConfigFile();

    expect(file).toBe(configFile);
  });
});
