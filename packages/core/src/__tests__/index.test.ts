import { describe, expect, it, afterEach, beforeAll } from "vitest";

import { join } from "node:path";
import fs from "fs-extra";
import type { ExecaSyncReturnValue, SyncOptions } from "execa";
import { execaCommandSync } from "execa";

const CLI_PATH = join(__dirname, "../../dist/");

const projectName = "test-app";
const genPath = join(__dirname, projectName);

const run = (
  args: string[],
  options: SyncOptions = {}
): ExecaSyncReturnValue => {
  // console.dir(args);
  // console.dir(CLI_PATH);
  return execaCommandSync(`node ${CLI_PATH} ${args.join(" ")}`, options);
};

// import { lib } from '..';

fs.mkdirpSync(genPath);

describe("lib", () => {
  beforeAll(() => fs.remove(genPath));
  afterEach(() => fs.remove(genPath));

  it("prompts for the project name if none supplied", () => {
    const { stdout } = run([]);
    console.dir(stdout);
    expect(stdout).toContain("please check this is a minecat project");
  });

  it("should render lib", () => {
    // expect(lib()).toBe('lib');
  });
});
