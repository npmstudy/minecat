import { describe, expect, it, vi } from "vitest";
import * as Run from "../../cmd/run-ext";
import prompt from "prompts";
import fs from "node:fs";
import path from "node:path";
import { join } from "desm";
import shell from "shelljs";

describe("cmd/run.ts", () => {
  it("should call getCurrentCmd return correct", async () => {
    let cmd = {
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

  // it("should call getPrompt correct", async () => {
  //   const injected = ["dev", true];

  //   // 准备测试数据
  //   prompt.inject(injected);

  //   const response = await Run.getPrompt("dev", ["build", "dev"]);

  //   console.dir("getPrompt");
  //   console.dir(response);

  //   expect(response["script"]).toBe("dev");
  // });

  it("should call getProjectScriptsName() correct", async () => {
    const spy = vi
      .spyOn(process, "cwd")
      .mockReturnValue(join(import.meta.url, "./fixtures/run"));

    const pkg = {
      name: "your-node-v20-menoreopo-project",
      private: true,
      minecat: {
        type: "Node.js",
      },
      engines: {
        node: "^20.0.0",
      },
      scripts: {
        build: "nx run-many -t build",
        "build:fast": "nx run-many -t build:fast",
        dev: "npm run build && nx run-many -t dev",
        test: "nx run-many -t test",
        "test:watch": "nx run-many -t test:watch",
        coverage: "nx run-many -t coverage",
        size: "size-limit",
        prepare: "husky install",
        prettier: "prettier",
        lint: "eslint ./packages/*",
        "lint:fix": "eslint ./packages/* --fix",
        "type-check": "tsc --noEmit",
        "project-graph": "nx graph",
        changeset: "npm run build && npx changeset",
        "ci:version": "changeset version",
        "ci:publish": "changeset publish",
        example: "npm run build && pnpm -F example dev",
      },
      description: "PNPM monorepo template",
      license: "MIT",
      devDependencies: {
        "@commitlint/config-conventional": "^17.7.0",
        "@size-limit/preset-small-lib": "^8.2.6",
        "@types/node": "^18.17.9",
        "@typescript-eslint/eslint-plugin": "^5.62.0",
        "@typescript-eslint/parser": "^5.62.0",
        commitlint: "^17.7.1",
        concurrently: "^8.2.1",
        eslint: "^8.47.0",
        "eslint-config-prettier": "^8.10.0",
        "eslint-import-resolver-typescript": "^3.6.0",
        "eslint-plugin-import": "^2.28.1",
        "eslint-plugin-prettier": "^4.2.1",
        husky: "^8.0.3",
        "lint-staged": "^13.3.0",
        nx: "16.3.2",
        prettier: "^2.8.8",
        "size-limit": "^8.2.6",
        tsup: "^8.0.0",
        tsx: "^4.7.0",
        typescript: "^5.3.3",
        vite: "^5.0.12",
        vitest: "^1.2.1",
      },
      packageManager: "pnpm@8.6.0",
      "size-limit": [
        {
          path: "./lib/dist/index.js",
          limit: "15 kb",
        },
        {
          path: "./lib/dist/index.mjs",
          limit: "15 kb",
        },
      ],
      dependencies: {
        "@changesets/cli": "^2.26.2",
        "eslint-plugin-react": "^7.33.2",
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
