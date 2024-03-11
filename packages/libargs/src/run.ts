import { join } from "node:path";
import os from "node:os";
import { pathToFileURL } from "node:url";
import type { PrintTable } from "./util";
import Debug from "debug";
import type { Command } from "./types";

const debug = Debug("libargs");
/**
 * Run the given command with the given flags.
 * NOTE: This function provides no error handling, so be sure
 * to present user-friendly error output where the fn is called.
 **/
export async function runCommand(cmd: Command) {
	// console.dir(cmd);
	if (!cmd.name) {
		// No command handler matched! This is unexpected.
		throw new Error(`Error running ${cmd} -- no command found.`);
	}

	let flag: [string, string][];
	let table: PrintTable = {};

	if (cmd.flags) {
		flag = Object.keys(cmd.flags).map((f) => [f, cmd.flags[f]]);

		table = {
			Flags: flag,
		};
	} else {
		table = {
			Flags: [[" - no flag", ""]],
		};
	}

	// These commands can run directly without parsing the user config.
	// 当cmd目录下，有同名目录，可能会有坑
	const isWin = os.platform() === "win32";

	let moduleURL: string;
	if (isWin) {
		moduleURL = pathToFileURL(join(cmd.dir, `${cmd.file || cmd.name}.js`)).href;
	} else {
		moduleURL = join(
			cmd.dir.replace("src", "dist"),
			`${cmd.file || cmd.name}.js`,
		);
	}

	try {
		const fn = await import(moduleURL);
		debug(fn);
		debug(cmd.fnName || "default");
		debug(fn[cmd.fnName || "default"]);
		await fn[cmd.fnName || "default"](cmd, process.cwd());
	} catch (error) {
		console.dir(error);
	}
}
