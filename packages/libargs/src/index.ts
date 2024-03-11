import yargs from "yargs-parser";

import Debug from "debug";

const debug = Debug("libargs");

import { runCommand } from "./run";
import { printHelp } from "./util";

import type { PrintTable } from "./util";

export * as colors from "kleur/colors";

/** Determine which command the user requested */
function resolveCommand(
  commands: CliConfig["commands"],
  flags: yargs.Arguments,
) {
  const clonedCommands = { ...commands };
  const cmdKeys = new Set(Object.keys(clonedCommands));
  const cmdAlias = new Set(Object.values(clonedCommands).map((it) => it.alias));

  // console.dir("clonedCommands");
  // console.dir(clonedCommands);
  const cmd = flags._[2] as string;
  if (flags.version) return "version";

  if (!cmd) return "help";

  if (cmdKeys.has(cmd)) {
    return cmd;
  }
  if (cmdAlias.has(cmd)) {
    // 根据alias查找cmd
    return Object.entries(clonedCommands)
      .map(([k, v]) => ({ ...v, cmdKey: k }))
      .find((it) => it.alias === cmd).cmdKey;
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
  input?: yargs.Arguments;
  usage?: string;
  fnName?: string;
  file?: string;
  flags?: CommandFlags;
  alias?: string;
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
  version?: string;
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
  // console.log("🚀 ~ cli ~ flags:", flags)
  // const cfg = arguments.callee.cfg;
  // const supportedCommands = new Set(Object.keys(cfg.commands));
  // console.log("🚀 ~ cli ~ supportedCommands:", supportedCommands)
  // console.dir(cfg.commands[cmd]);
  const cmds: [string, string][] = Object.keys(cfg.commands).map((cmd) => {
    return [
      cfg.commands[cmd].alias ? `${cfg.commands[cmd].alias},${cmd}` : cmd,
      cfg.commands[cmd].desc,
    ];
  });

  const flag: [string, string][] = Object.keys(cfg.flags).map((f) => [
    f,
    cfg.flags[f],
  ]);

  const table: PrintTable = {
    Commands: cmds,
    "Global Flags": flag,
  };

  const cmd = resolveCommand(cfg.commands, flags);

  try {
    if (cmd === "help") {
      printHelp({
        version: cfg?.version,
        commandName: cfg.name,
        usage: cfg.usage || "[command] [...flags]",
        headline: cfg.desc,
        tables: {
          Commands: cmds,
          "Global Flags": flag,
        },
      });
      return;
    }
    flags._ = flags._.slice(3);

    cfg.commands[cmd].name = cmd;
    cfg.commands[cmd].show = `${cfg.name} ${cmd}`;
    cfg.commands[cmd].dir = cfg.dir;
    cfg.commands[cmd].input = flags;
    debug(cfg.commands[cmd]);
    await runCommand(cfg.commands[cmd]);
  } catch (err) {
    await throwAndExit(cmd, err);
  }
}
