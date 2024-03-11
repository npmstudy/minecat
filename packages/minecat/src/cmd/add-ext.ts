import prompts from "prompts";
import debug from "debug";
import { homedir } from "os";
import fs from "fs";
import shell from "shelljs";
import { getDirectories } from "../utils";
import type {
  MinecatPackageJson,
  MinecatProjectType,
} from "../types/package-json";

import path from "path";

const log = debug("minecat");

export function renamePackageName(newname) {
  try {
    const configFile = path.join(
      process.cwd(),
      "/packages/",
      newname,
      "/package.json"
    );
    const json = JSON.parse(fs.readFileSync(configFile).toString());
    json.name = newname;
    fs.writeFileSync(configFile, JSON.stringify(json, null, 4));
  } catch (error) {
    throw error;
  }
}

export function getProjectType(): MinecatProjectType {
  let proj_type: MinecatProjectType;
  try {
    const json: MinecatPackageJson = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "/package.json")).toString()
    );
    if (!json.minecat) {
      console.log("please check this is a minecat project");
      return;
    } else {
      // proj_package_json = json;
      proj_type = json.minecat.type;
      // proj_script_names = Object.keys(json.scripts);
      // console.dir(proj_script_names);
      log("this is a minecat project with type = " + json.minecat.type);

      const originalPkgDir = path.join(process.cwd(), "/packages");

      const pkgs = getDirectories(originalPkgDir);

      log(pkgs);

      // mv pkg to ~/.minecat/Node.js/xxx
      for (const i in pkgs) {
        const json = JSON.parse(
          fs
            .readFileSync(
              path.join(process.cwd(), "/packages/", pkgs[i], "/package.json")
            )
            .toString()
        );

        // pkg_list[json.name] = json;
      }
      // pkg_names = Object.keys(pkg_list);
    }
  } catch (e) {
    console.error(e);
  }
  return proj_type;
}

export async function getPrompts(proj_type, moduleName) {
  const pkgHome = `${homedir()}/.minecat/${proj_type}/`;

  if (!fs.existsSync(pkgHome)) {
    fs.mkdirSync(pkgHome, { recursive: true });
  }

  const pkgs = getDirectories(pkgHome);

  const appChoices = Object.keys(pkgs).map((x) => {
    return { title: pkgs[x], value: pkgs[x] };
  });

  const questions: any = [
    {
      type: "text",
      name: "newname",
      initial: moduleName,
      message: "What is the name of your new module?",
    },
    {
      type: "select",
      name: "tpl",
      message: "What is your module template?",
      choices: appChoices,
    },
    {
      type: "confirm",
      name: "confirm",
      initial: true,
      message: (prev, values) =>
        `Please confirm that you add ${prev} module to project in current directory?`,
    },
  ];

  const response = await prompts(questions);

  return { response: response, pkgHome: pkgHome };
}
