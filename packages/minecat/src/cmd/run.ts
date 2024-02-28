import prompts from "prompts";
import debug from "debug";
import { homedir } from "os";
import fs from "fs";
import shell from "shelljs";
import { getDirectories } from "../util";

const log = debug("minecat");

let proj_type;
let proj_package_json;
let proj_script_names;
let pkg_list = {};
let pkg_names = [];

export async function ada(cmd) {
  try {
    const json = JSON.parse(
      fs.readFileSync(process.cwd() + "/package.json").toString()
    );
    if (!json.minecat) {
      console.log("please check this is a minecat project");
      return;
    } else {
      proj_package_json = json;
      proj_type = json.minecat.type;
      proj_script_names = Object.keys(json.scripts);
      // console.dir(proj_script_names);
      log("this is a minecat project with type = " + json.minecat.type);

      const originPkgDir = process.cwd() + "/packages";

      const pkgs = getDirectories(originPkgDir);

      log(pkgs);

      // mv pkg to ~/.minecat/Node.js/xxx
      for (const i in pkgs) {
        const json = JSON.parse(
          fs
            .readFileSync(
              process.cwd() + "/packages/" + pkgs[i] + "/package.json"
            )
            .toString()
        );

        pkg_list[json.name] = json;
      }
      pkg_names = Object.keys(pkg_list);
    }
  } catch (e) {
    console.error(e);
  }

  if (!proj_type) {
    console.dir("当前不是minecat项目，或者没有在项目根目录");
    return;
  }

  console.dir(proj_script_names);

  try {
    let scripts_choices = [];
    for (var i in proj_script_names) {
      let name = proj_script_names[i];
      scripts_choices.push({ title: name, value: name });
    }
    const questions: any = [
      {
        type: "select",
        name: "script",
        message: "What is your script will run?",
        choices: scripts_choices,
      },
      {
        type: "confirm",
        name: "confirm",
        initial: true,
        message: (prev, values) =>
          `Please confirm that you choose ${prev} to init project in current directory?`,
      },
    ];
    const response = await prompts(questions);

    log(response); // => { value: 24 }

    if (response.confirm) {
      log(response.script);

      const cmd = `npx pnpm ${response.script}`;

      if (shell.exec(cmd).code !== 0) {
        shell.echo("Error: pnpm run failed: " + cmd);
        shell.exit(1);
      }
    }
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }

  console.dir("done");
}
