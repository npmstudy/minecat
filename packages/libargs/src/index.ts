import yargs from "yargs-parser";

import Debug from "debug";

const debug = Debug("libargs");

import { runCommand } from "./run";
import { printHelp } from "./util";

import type { PrintTable } from "./util";

export * as colors from "kleur/colors";

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

// 定义命令标志的类型
interface CommandFlags {
  [flag: string]: string;
}

// 定义命令的类型
interface Command {
  name?: string;
  desc: string;
  show?: string;
  dir?: string;
  usage?: string;
  fnName?: string;
  file?: string;
  flags?: CommandFlags;
}

// 定义commands的类型
interface Commands {
  [commandName: string]: Command;
}

// 定义flags的类型
interface Flags {
  [flag: string]: string;
}

// 定义整个对象的类型
export interface CliConfig {
  name?: string;
  desc: string;
  usage?: string;
  dir: string;
  commands?: Commands;
  flags?: Flags;
}

/** The primary CLI action */
export async function cli(cfg: CliConfig, args: string[]) {
  debug(cfg);
  const flags = yargs(args, { boolean: ["global"], alias: { g: "global" } });
  // const cfg = arguments.callee.cfg;
  const supportedCommands = new Set(Object.keys(cfg.commands));

  const cmds: [string, string][] = Object.keys(cfg.commands).map((cmd) => {
    return [cmd, cfg.commands[cmd]["desc"]];
  });

  const flag: [string, string][] = Object.keys(cfg.flags).map(function (f) {
    return [f, cfg.flags[f]];
  });

  const table: PrintTable = {
    Commands: cmds,
    "Global Flags": flag,
  };

  const cmd = resolveCommand(supportedCommands, flags);

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
      flags._ = flags._.slice(3);

      cfg.commands[cmd].name = cmd;
      cfg.commands[cmd].show = `${cfg.name} ${cmd}`;
      cfg.commands[cmd].dir = cfg.dir;
      cfg.commands[cmd]["input"] = flags;
      debug(cfg.commands[cmd]);
      await runCommand(cfg.commands[cmd]);
    }
  } catch (err) {
    await throwAndExit(cmd, err);
  }
}
