import { describe, expect, it, vi } from "vitest";
import * as Run from "../../cmd/run-ext";
import prompt from "prompts";
import fs from "node:fs";
import path from "node:path";
import { join } from "desm";
import shell from "shelljs";

import {
  getPrompts,
  renamePackageName,
  getProjectType,
} from "../../cmd/add-ext";

describe("cmd/add.ts", () => {
  it("should call getPrompts correct", async () => {
    vi.restoreAllMocks();
    const injected = ["newname", "lib", true];

    // 准备测试数据
    prompt.inject(injected);

    const { response } = await getPrompts("Node.js", "yourmodule");

    console.dir("getPrompt");
    console.dir(response);

    expect(response["newname"]).toBe("newname");
  });

  // it("should call getPrompts correct", async () => {
  //   const injected = ["newname", "lib", true];

  //   // 准备测试数据
  //   prompt.inject(injected);

  //   const response = await getPrompts("newname");

  //   console.dir("getPrompt");
  //   console.dir(response);

  //   expect(response["script"]).toBe("newname");
  // });

  it("should call getProjectType return correct", async () => {
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

    const c = getProjectType();

    expect(c).toBe("Node.js");
  });
});
