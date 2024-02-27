import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import prompts from "prompts";
import { dclone } from "dclone";
import fs, { readdirSync } from "fs";
import shell from "shelljs";
import { homedir } from "os";
import debug from "debug";
import { writeConfig, getConfig } from "../util";
const log = debug("minecat");

let proj_type;
let proj_package_json;
let proj_script_names;
let pkg_list = {};
let pkg_names = [];

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

let cfgJson;

export async function ada(cmd) {
  try {
    cfgJson = getConfig();
  } catch (error) {
    console.dir(error);
  }

  if (cmd.input["_"][0] === "list") {
    console.dir("---------current configuration--------");
    return console.dir(cfgJson);
  }

  const questions: any = [
    {
      type: "text",
      name: "newtpl",
      initial: "",
      message: "What is the name of your tpl config?",
    },
    {
      type: "text",
      name: "newrepo",
      initial: "",
      message: "What is the repo url of your config?",
    },
    {
      type: "confirm",
      name: "confirm",
      initial: true,
      message: (prev, values) => `Please confirm ?`,
    },
  ];
  const response = await prompts(questions);
  // console.dir(response);

  // console.dir(cfgJson);

  if (response["newrepo"].indexOf("http") !== -1) {
    cfgJson[response["newtpl"]] = response["newrepo"];

    // if (argv["name"] && argv.repo_url)
    //   cfgJson[argv["name"] as string] = argv.repo_url;
    // if (argv.verbose) console.dir(cfgJson);

    await writeConfig(cfgJson);

    console.dir(cfgJson);
    console.dir("done!");
  } else {
    console.dir("请重新输入repo 地址");
  }

  // console.dir(flags);
}
