import debug from "debug";
import {
  getCurrentCmd,
  getProjectScriptsName,
  getPrompt,
  runCmd,
} from "./run-ext";

const log = debug("minecat");

export * from "./run-ext";

export async function ada(cmd) {
  const { proj_type, proj_script_names } = getProjectScriptsName();

  if (!proj_type) {
    console.dir("当前不是minecat项目，或者没有在项目根目录");
    return;
  }
  const currentCmd = getCurrentCmd(cmd);

  log(proj_script_names);
  try {
    const response = getPrompt(currentCmd, proj_script_names);

    log(response); // => { value: 24 }

    if (response.confirm) {
      log(response.script);

      const cmd = `npx pnpm ${response.script}`;

      runCmd(cmd);
    }
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }

  console.dir("done");
}
