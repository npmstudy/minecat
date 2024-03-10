import debug from "debug";

import type {
  MinecatPackageJson,
  MinecatProjectType,
} from "../types/package-json";

import { getPrompts, moveTplToDestination, renamePackageName } from "./add-ext";

const log = debug("minecat");

let proj_type: MinecatProjectType;

export async function add(cmd) {
  const moduleName =
    cmd.input["_"].length !== 0 ? cmd.input["_"][0] : "yourmodule";

  const { response, pkgHome } = await getPrompts(moduleName);
  // console.dir(response);

  if (!proj_type) {
    console.dir("当前不是minecat项目，或者没有在项目根目录");
    return;
  }

  // 如果newname不存在，就拷贝tpl到newname
  moveTplToDestination(pkgHome, response);

  // rename package name
  renamePackageName(response);

  console.dir("done");
}
