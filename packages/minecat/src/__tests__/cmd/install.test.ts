import { describe, beforeAll } from "vitest";
import { join } from "desm";
import { init } from "../../cmd/init";
import {
  getPackageJson,
  getPkgPackageJson,
  getOriginPkgDir,
  getProjInfo,
  getPromptRes,
  pnpmAddShell,
  ada,
} from "../../cmd/install";
import prompt from "prompts";
import path from "path";
import shell from "shelljs";

const initInstallProject = async () => {
  const apptype = "Node.js";
  const newname = "test-install";
  const confirm = true;

  const injected = [apptype, newname, confirm];
  prompt.inject(injected);

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

  try {
    await init(cmd);
  } catch (error) {
    console.dir(error);
  }
};

describe("cmd/install", () => {
  beforeAll(async () => {
    // console.dir("beforeAll");
    await initInstallProject();
  });

  it("should getPackageJson()", async () => {
    vi.spyOn(process, "cwd").mockReturnValue(
      join(import.meta.url, "../../../test-install")
    );

    const json = getPackageJson();

    const mockJson = {
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

    expect(json).toStrictEqual(mockJson);
  });

  it("should getPkgPackageJson()", () => {
    vi.spyOn(process, "cwd").mockReturnValue(
      join(import.meta.url, "../../../test-install")
    );

    const libJson = getPkgPackageJson("lib");
    const lib2Json = getPkgPackageJson("lib2");

    const mockLibJson = {
      name: "lib",
      version: "0.0.1",
      description: "My Awesome lib",
      license: "MIT",
      publishConfig: {
        access: "public",
      },
      author: "npmstudy <npmstudy@qq.com>",
      main: "./dist/index.js",
      module: "./dist/index.mjs",
      types: "./dist/index.d.ts",
      files: ["dist"],
      scripts: {
        build: "tsup src -- --dts-resolve",
        "build:fast": "tsup src",
        dev: "tsup src --watch",
        test: "vitest run",
        "test:watch": "vitest watch",
        coverage: "vitest run --coverage",
      },
      keywords: ["awesome-keywords"],
      devDependencies: {
        "@vitest/coverage-v8": "^1.0.1",
        "happy-dom": "^6.0.4",
      },
    };

    const mockLib2Json = {
      name: "lib2",
      version: "0.0.1",
      description: "My Awesome lib",
      license: "MIT",
      publishConfig: {
        access: "public",
      },
      author: "npmstudy <npmstudy@qq.com>",
      main: "./dist/index.js",
      module: "./dist/index.mjs",
      types: "./dist/index.d.ts",
      files: ["dist"],
      scripts: {
        build: "tsup src -- --dts-resolve",
        "build:fast": "tsup src",
        dev: "tsup src --watch",
        test: "vitest run",
        "test:watch": "vitest watch",
        coverage: "vitest run --coverage",
      },
      keywords: ["awesome-keywords"],
      devDependencies: {
        "@vitest/coverage-v8": "^1.0.1",
        "happy-dom": "^6.0.4",
      },
    };

    expect(libJson).toStrictEqual(mockLibJson);
    expect(lib2Json).toStrictEqual(mockLib2Json);
  });

  it("should getOriginPkgDir()", () => {
    vi.spyOn(process, "cwd").mockReturnValue(
      join(import.meta.url, "../../../test-install")
    );

    const pkgDir = getOriginPkgDir();

    expect(pkgDir).toStrictEqual(path.join(process.cwd(), "packages"));
  });

  it("should getOriginPkgDir()", () => {
    vi.spyOn(process, "cwd").mockReturnValue(
      join(import.meta.url, "../../../test-install")
    );

    const pkgDir = getOriginPkgDir();

    expect(pkgDir).toStrictEqual(path.join(process.cwd(), "packages"));
  });

  it("should getProjInfo()", () => {
    vi.spyOn(process, "cwd").mockReturnValue(
      join(import.meta.url, "../../../test-install")
    );

    const json = getPackageJson();
    const projInfo = getProjInfo(json);

    expect(projInfo).toStrictEqual({
      proj_type: "Node.js",
      proj_package_json: getPackageJson(),
      proj_script_names: [
        "build",
        "build:fast",
        "dev",
        "test",
        "test:watch",
        "coverage",
        "size",
        "prepare",
        "prettier",
        "lint",
        "lint:fix",
        "type-check",
        "project-graph",
        "changeset",
        "ci:version",
        "ci:publish",
        "example",
      ],
      pkg_list: {
        lib: getPkgPackageJson("lib"),
        lib2: getPkgPackageJson("lib2"),
      },
      pkg_names: ["lib", "lib2"],
    });
  });

  it("should getPromptRes()", async () => {
    const pkgname = "lib";
    const dependencytype = "dev dependency";
    const confirm = true;

    const injected = [pkgname, dependencytype, confirm];
    prompt.inject(injected);

    const json = getPackageJson();
    const projInfo = getProjInfo(json);
    const promptRes = await getPromptRes(projInfo);

    expect(promptRes).toStrictEqual({
      pkgname: "lib",
      dependencytype: "dev dependency",
      confirm: true,
    });
  });

  it("should pnpmAddShell()", async () => {
    vi.spyOn(process, "cwd").mockReturnValue(
      join(import.meta.url, "../../../test-install")
    );

    const promptRes = {
      pkgname: "lib",
      dependencytype: "dev dependency",
      confirm: true,
    };
    pnpmAddShell(promptRes, ["buffer"]);

    const libJson = getPkgPackageJson("lib");
    const hasBuffer = typeof libJson?.devDependencies?.buffer !== undefined;
    expect(hasBuffer).toBe(true);
  });

  it("should init()", async () => {
    const pkgname = "lib2";
    const dependencytype = "dev dependency";
    const confirm = true;

    const injected = [pkgname, dependencytype, confirm];
    prompt.inject(injected);

    let cmd = {
      input: { _: ["buffer"] },
    };

    await ada(cmd);

    const lib2Json = getPkgPackageJson("lib2");
    const hasBuffer = typeof lib2Json?.devDependencies?.buffer !== undefined;
    expect(hasBuffer).toBe(true);
  });

  afterAll(() => {
    shell.exec(`rm -rf test-install`);
  });
});
