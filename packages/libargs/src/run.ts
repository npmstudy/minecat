import yargs from "yargs-parser";
import { printHelp } from "./util";
/**
 * Run the given command with the given flags.
 * NOTE: This function provides no error handling, so be sure
 * to present user-friendly error output where the fn is called.
 **/
export async function runCommand(cmd) {
  // console.dir(cmd);
  if (!cmd.name) {
    // No command handler matched! This is unexpected.
    throw new Error(`Error running ${cmd} -- no command found.`);
  }

  if (cmd.name === "help") {
    console.dir("help");
    return;
  }

  const input = cmd.input;
  if (input?.help || input?.h) {
    const flag = Object.keys(cmd.flags).map(function (f) {
      return [f, cmd.flags[f]];
    });

    printHelp({
      commandName: cmd.show,
      usage: cmd.usage || "[...flags]",
      tables: {
        Flags: flag,
      },
      description: cmd.desc,
    });
    return 0;
  } else {
    // These commands can run directly without parsing the user config.
    const fn = await import(cmd.dir + `/${cmd.file || cmd.name}`);
    // console.dir(fn.default);
    await fn[cmd["fnName"] || "default"](cmd);
  }
}
