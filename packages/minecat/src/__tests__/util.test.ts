import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { homedir } from "node:os";
import fs from "node:fs";
import fsx from "fs-extra";
import path from "node:path";
import { join } from "desm";
import {
  DEFAULT_CONFIGS,
  extractGitHubRepoInfo,
  getConfig,
  getConfigFile,
  getDirectories,
  getSafeHomeDir,
  writeConfig,
  moveTo,
} from "../utils";

const home = path.join(homedir(), "/.minecat");

describe("config.ts", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    if (fs.existsSync(home)) {
      fs.rmdirSync(home, { recursive: true });
    }
  });
  afterEach(() => {
    if (fs.existsSync(home)) {
      fs.rmdirSync(home, { recursive: true });
    }
  });
  it("should resolve correct config file location", () => {
    const configFile = path.join(homedir(), `/.minecat/config.json`);
    const file = getConfigFile();
    expect(file).toBe(configFile);
  });

  describe("getConfig", () => {
    it("should write while config does not exist", () => {
      if (fs.existsSync(home)) {
        fs.rmdirSync(home, { recursive: true });
      }

      const result = getConfig();
      expect(result).toEqual(DEFAULT_CONFIGS);
    });

    it("should throw if config file is broken", () => {
      const configFile = getConfigFile();
      fs.writeFileSync(configFile, "a=1");
      expect(() => getConfig()).toThrow();
    });
  });

  describe("writeConfig", () => {
    it("should writeConfig", () => {
      const file = getConfigFile();
      writeConfig({ a: 1 });
      // TODO: should add some validation for config writing
      expect(fsx.readJsonSync(file)).toEqual({ a: 1 });
    });

    it("should throw when config is invalid", () => {
      const spy = vi.spyOn(console, "dir");
      // meaningless testing, using BigInt to make JSON.stringify upset
      writeConfig({ x: 2n });
      expect(spy).toHaveBeenCalledOnce();
    });
  });
});

describe("utils/dir.ts", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    if (fs.existsSync(home)) {
      fs.rmdirSync(home, { recursive: true });
    }
  });
  afterEach(() => {
    if (fs.existsSync(home)) {
      fs.rmdirSync(home, { recursive: true });
    }
  });

  it("should ensure minecat home dir and return", () => {
    expect(fs.existsSync(home)).toBe(false);
    const spy = vi.spyOn(fs, "mkdirSync");
    const dir = getSafeHomeDir();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(dir).toBe(home);
  });

  it("should getDirectories /packages/* return 2（minecat & libargs）", () => {
    const pkgs = getDirectories("../../packages/");
    expect(pkgs.length).toBe(2);
  });
});

describe("utils/parse.ts", () => {
  it("should extractGitHubRepoInfo a git repo return username and reponame", () => {
    const { owner, name } = extractGitHubRepoInfo(
      "https://github.com/npmstudy/your-node-v20-monoreopo-project"
    );
    expect(owner).toBe("npmstudy");
    expect(name).toBe("your-node-v20-monoreopo-project");
  });
});

describe("utils/shell.ts", () => {
  it("should call moveTo right", () => {
    // 创建from
    // 创建to
    // 调用moveTo

    const spy = vi
      .spyOn(process, "cwd")
      .mockReturnValue(join(import.meta.url, "./fixtures/run"));

    const from = path.join(process.cwd(), "from");
    const to = path.join(process.cwd(), "to");

    fs.mkdirSync(from, { recursive: true });
    fs.mkdirSync(to, { recursive: true });

    const file = path.join(from, "/package.json");

    if (!fs.existsSync(file)) {
      fs.writeFileSync(path.join(file), JSON.stringify({ a: 1 }, null, 4));
    }

    moveTo(from, to);

    const files = fs.readdirSync(to);
    expect(files[0]).toBe("from");

    const files2 = fs.readdirSync(path.join(to, "/from"));
    expect(files2[0]).toBe("package.json");
    // 清理
    fs.rmdirSync(process.cwd(), { recursive: true });
  });
});
