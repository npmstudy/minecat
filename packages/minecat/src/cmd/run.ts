import prompts from "prompts";
import debug from "debug";
// import { homedir } from "os";
import fs from "fs";
import shell from "shelljs";
import { getDirectories } from "../utils";

const log = debug("minecat");

export async function ada(cmd) {
  const { proj_type, proj_script_names } = getProjectScriptsName();

  if (!proj_type) {
    console.dir("当前不是minecat项目，或者没有在项目根目录");
    return;
  }

  let currentCmd;
  if (cmd.input["_"][0]) {
    // console.dir("---------current configuration--------");
    currentCmd = cmd.input["_"][0];
  }

  log(proj_script_names);

  try {
    let scripts_choices = [];
    for (var i in proj_script_names) {
      let name = proj_script_names[i];
      scripts_choices.push({ title: name, value: name });
    }
    const isValid = proj_script_names.includes(currentCmd);

    if (!isValid) {
      console.dir(
        `your input cmd is ${currentCmd}, not support in package.json`
      );
    }

    const first = isValid
      ? {
          type: "text",
          name: "script",
          message: "What is your script will run?",
          initial: currentCmd,
        }
      : {
          type: "select",
          name: "script",
          message: "What is your script will run?",
          choices: scripts_choices,
        };

    const questions: any = [
      first,
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

function getProjectScriptsName(): any {
  let proj_type;
  let proj_script_names;
  try {
    const json = JSON.parse(
      fs.readFileSync(process.cwd() + "/package.json").toString()
    );
    if (!json.minecat) {
      console.log("please check this is a minecat project");
      return;
    } else {
      // proj_package_json = json;
      proj_type = json?.minecat?.type;
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

        // pkg_list[json.name] = json;
      }
      // pkg_names = Object.keys(pkg_list);

      return { proj_type: proj_type, proj_script_names: proj_script_names };
    }
  } catch (e) {
    console.error(e);
  }
}
