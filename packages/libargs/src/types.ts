import type { Arguments } from "yargs-parser";

interface Flags {
	[flag: string]: string;
}

type CommandFlags = Flags;

export type CommandType = string;

export interface Command {
	name?: string;
	desc: string;
	show?: string;
	dir?: string;
	usage?: string;
	fnName?: string;
	input?: Arguments;
	file?: string;
	flags?: CommandFlags;
	alias?: string;
}

export interface Commands {
	[commandName: CommandType]: Command;
}

export interface CliConfig {
	name?: string;
	version?: string;
	desc: string;
	usage?: string;
	dir: string;
	commands?: Commands;
	flags?: Flags;
}
