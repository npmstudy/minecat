import prompts from "prompts";
import debug from "debug";
import { writeConfig, getConfig } from "../util";
const log = debug("minecat");

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
  log(response);
  log(cfgJson);

  if (response["newrepo"].indexOf("http") !== -1) {
    cfgJson[response["newtpl"]] = response["newrepo"];
    await writeConfig(cfgJson);

    console.dir(cfgJson);
    console.dir("done!");
  } else {
    console.dir("请重新输入repo 地址");
  }
}
