import yargs from "yargs-parser";
import Debug from "debug";
import { runCommand } from "./run";
import { printHelp } from "./util";
import type { PrintTable } from "./util";
import type { CliConfig, CommandType } from "./types";

const debug = Debug("libargs");

/** Determine which command the user requested */
function resolveCommand(
	commands: CliConfig["commands"],
	flags: yargs.Arguments,
): CommandType {
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

export async function throwAndExit(_cmd: string, err: unknown) {
	throw err;
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

	const cmd = resolveCommand(cfg.commands, flags);

	try {
		if (cmd === "help") {
			const tables: PrintTable = {
				Commands: cmds,
				"Global Flags": flag,
			};

			printHelp({
				version: cfg?.version,
				commandName: cfg.name,
				usage: cfg.usage || "[command] [...flags]",
				headline: cfg.desc,
				tables,
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

export * as colors from "kleur/colors";
export * from "./types";
