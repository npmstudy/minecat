import debug from "debug";
import path from "path";

import type {
  MinecatPackageJson,
  MinecatProjectType,
} from "../types/package-json";

import { getPrompts, renamePackageName, getProjectType } from "./add-ext";

import { moveTo } from "../utils";

const log = debug("minecat");

let proj_type: MinecatProjectType;

export async function add(cmd) {
  const moduleName =
    cmd.input["_"].length !== 0 ? cmd.input["_"][0] : "yourmodule";

  const proj_type = getProjectType();

  const { response, pkgHome } = await getPrompts(proj_type, moduleName);
  // console.dir(response);

  if (!proj_type) {
    console.dir("当前不是minecat项目，或者没有在项目根目录");
    return;
  }

  // 如果newname不存在，就拷贝tpl到newname
  const from = path.join(pkgHome, "/", response.tpl);
  const to = path.join(process.cwd(), "/packages/", response["newname"]);

  moveTo(from, to);

  // rename package name
  renamePackageName(response);

  console.dir("done");
}
