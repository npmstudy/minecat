import yargs from "yargs-parser";
import { printHelp } from "./util";
import type { PrintTable } from "./util";
import Debug from "debug";

const debug = Debug("libargs");
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
  let flag: [string, string][];
  let table: PrintTable = {};

  if (cmd.flags) {
    flag = Object.keys(cmd.flags).map(function (f) {
      return [f, cmd.flags[f]];
    });

    table = {
      Flags: flag,
    };
  } else {
    table = {
      Flags: [[" - no flag", ""]],
    };
  }

  cmd.help = function () {
    printHelp({
      commandName: cmd.show,
      usage: cmd.usage || "[...flags]",
      tables: table,
      description: `  ${cmd.desc}`,
    });
  };

  if (input?.help || input?.h) {
    cmd.help();
    return 0;
  } else {
    // These commands can run directly without parsing the user config.
    // 当cmd目录下，有同名目录，可能会有坑
    const fn = await import(cmd.dir + `/${cmd.file || cmd.name}.js`);
    debug(fn);
    debug(cmd["fnName"] || "default");
    debug(fn[cmd["fnName"] || "default"]);
    await fn[cmd["fnName"] || "default"](cmd);
  }
}
