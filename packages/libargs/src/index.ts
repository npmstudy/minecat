import * as colors from "kleur/colors";
import yargs from "yargs-parser";

import { runCommand } from "./run";
import { printHelp } from "./util";

/** Determine which command the user requested */
function resolveCommand(supportedCommands, flags: yargs.Arguments) {
  const cmd = flags._[2] as string;
  if (flags.version) return "version";

  if (supportedCommands.has(cmd)) {
    return cmd;
  }
  return "help";
}

export async function throwAndExit(cmd: string, err: unknown) {
  throw err;
}

/** The primary CLI action */
export async function cli(cfg, args: string[]) {
  const flags = yargs(args, { boolean: ["global"], alias: { g: "global" } });
  // const cfg = arguments.callee.cfg;
  const supportedCommands = new Set(Object.keys(cfg.commands));

  const cmds = Object.keys(cfg.commands).map(function (cmd) {
    return [cmd, cfg.commands[cmd]["desc"]];
  });

  const flag = Object.keys(cfg.flags).map(function (f) {
    return [f, cfg.flags[f]];
  });

  const cmd = resolveCommand(supportedCommands, flags);
  // console.dir(cmd == "help");

  try {
    if (cmd == "help") {
      printHelp({
        commandName: cfg.name,
        usage: cfg.usage || "[command] [...flags]",
        headline: cfg.desc,
        tables: {
          Commands: cmds,
          "Global Flags": flag,
        },
      });
      return;
    } else {
      // const a = flags._.slice(3);
      // console.dir(a);

      flags._ = flags._.slice(3);

      cfg.commands[cmd].name = cmd;
      cfg.commands[cmd].show = `${cfg.name} ${cmd}`;
      cfg.commands[cmd].dir = cfg.dir;
      cfg.commands[cmd]["input"] = flags;

      // console.dir(flags);
      await runCommand(cfg.commands[cmd]);
    }
  } catch (err) {
    await throwAndExit(cmd, err);
  }
}
