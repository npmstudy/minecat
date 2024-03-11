// import { homedir } from "os";
import fs from "node:fs";
import debug from "debug";
import prompts from "prompts";
import shell from "shelljs";

const log = debug("minecat");

export function getCurrentCmd(cmd) {
  let currentCmd;
  if (cmd.input._[0]) {
    // console.dir("---------current configuration--------");
    currentCmd = cmd.input._[0];
  }
  return currentCmd;
}

export function runCmd(cmd) {
  const res = shell.exec(cmd);
  if (res.code !== 0) {
    shell.echo(`Error: pnpm run failed: ${cmd}`);
    shell.exit(1);
  }
  return res;
}

export async function getPrompt(currentCmd, proj_script_names) {
  const scripts_choices = [];
  for (const i in proj_script_names) {
    const name = proj_script_names[i];
    scripts_choices.push({ title: name, value: name });
  }
  const isValid = proj_script_names.includes(currentCmd);

  if (!isValid) {
    console.log(`your input cmd is ${currentCmd}, not support in package.json`);
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

  return await prompts(questions);
}

export function getProjectScriptsName(): any {
  let proj_type;
  let proj_script_names;

  const json = JSON.parse(
    fs.readFileSync(`${process.cwd()}/package.json`).toString(),
  );
  console.dir(json);
  if (!json.minecat) {
    console.log("please check this is a minecat project");
    return;
  }
  // proj_package_json = json;
  proj_type = json?.minecat?.type;
  proj_script_names = Object.keys(json.scripts);
  // console.dir(proj_script_names);
  log(`this is a minecat project with type = ${json.minecat.type}`);

  // pkg_names = Object.keys(pkg_list);

  return { proj_type: proj_type, proj_script_names: proj_script_names };
}
