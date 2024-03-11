import prompts from "prompts";
import debug from "debug";
import fs from "fs";
import shell from "shelljs";
import { getDirectories } from "../utils";
import path from "path";

const log = debug("minecat");

export async function ada(cmd) {
  if (cmd.input["_"].length === 0) {
    return cmd.help();
  }

  try {
    const json = getPackageJson();
    if (!json.minecat) {
      console.log("please check this is a minecat project");
      return;
    } else {
      log("this is a minecat project with type = " + json.minecat.type);

      const projInfo = getProjInfo(json);

      if (!projInfo.proj_type) {
        console.dir("当前不是minecat项目，或者没有在项目根目录");
        return;
      }

      if (cmd.verbose) console.dir("pkg names=" + projInfo.pkg_names);

      const depts = cmd.input._;

      if (cmd.verbose) console.log("install packages: " + depts);

      const response = await getPromptRes(projInfo);

      if (response.confirm) {
        pnpmAddShell(response, depts);
      }

      console.dir("done!");
    }
  } catch (e) {
    console.error(e);
  }
}

export function getPackageJson() {
  const pkgPath = path.join(process.cwd(), "package.json");
  const json = JSON.parse(fs.readFileSync(pkgPath).toString());
  return json;
}

export function getPkgPackageJson(pkg: string) {
  const pkgPath = path.join(process.cwd(), "packages", pkg, "package.json");
  const json = JSON.parse(fs.readFileSync(pkgPath).toString());
  return json;
}

export function getOriginPkgDir() {
  return path.join(process.cwd(), "packages");
}

export function getProjInfo(json) {
  let proj_type;
  let proj_package_json;
  let proj_script_names;
  let pkg_list = {};
  let pkg_names = [];

  proj_package_json = json;
  proj_type = json.minecat.type;
  proj_script_names = Object.keys(json.scripts);
  // console.dir(proj_script_names);

  const originPkgDir = getOriginPkgDir();

  const pkgs = getDirectories(originPkgDir);

  log(pkgs);

  // mv pkg to ~/.minecat/Node.js/xxx
  for (const i in pkgs) {
    const pkg = pkgs[i];
    const json = getPkgPackageJson(pkg);
    pkg_list[json.name] = json;
  }
  pkg_names = Object.keys(pkg_list);

  return {
    proj_type,
    proj_package_json,
    proj_script_names,
    pkg_list,
    pkg_names,
  };
}

export async function getPromptRes(projInfo) {
  let pgk_choices = [];
  for (var i in projInfo.pkg_names) {
    let name = projInfo.pkg_names[i];
    pgk_choices.push({ title: name, value: name });
  }

  try {
    const questions: any = [
      {
        type: "select",
        name: "pkgname",
        message: "What is your package name?",
        choices: pgk_choices,
      },
      {
        type: "select",
        name: "dependencytype",
        message: "What is your dependency type?",
        choices: [
          { title: "prod dependency", value: "proddependency" },
          { title: "dev dependency", value: "devdependency" },
        ],
      },
      {
        type: "confirm",
        name: "confirm",
        initial: true,
        message: (prev, values) => `Please confirm ?`,
      },
    ];
    const response = await prompts(questions);

    return response;
  } catch (cancelled: any) {
    console.log(cancelled.message);
    throw cancelled;
  }
}

export function pnpmAddShell(
  response: prompts.Answers<string>,
  depts: string[]
) {
  // if (cmd.verbose) console.log(response);
  const dept_type = response.dependencytype === "proddependency" ? "-P" : "-D";

  const cmd = `npx pnpm add ${depts.join(" ")} --filter ${
    response.pkgname
  } ${dept_type}`;
  // if (cmd.verbose) console.dir(cmd);

  // Run external tool synchronously
  if (shell.exec(cmd).code !== 0) {
    shell.echo("Error: pnpm add failed: " + cmd);
    shell.exit(1);
  }
}
