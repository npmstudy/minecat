import { join } from "desm";
import type { CliConfig } from "libargs";
import { version } from "../package.json";

export const config: CliConfig = {
	name: "minecat",
	version: version,
	desc: "a monorepo cli tool for Node.js、React",
	dir: join(import.meta.url, ".", "cmd"),
	commands: {
		init: {
			desc: "init a minecat project with pnpm.",
			file: "init",
			usage: "<project-name>",
			fnName: "init",
			// flags: {
			//   "--config1 <path>": "Specify your config file.",
			//   "--root1 <path>": "Specify your project root folder.",
			// },
		},
		add: {
			desc: "add a module in minecat project",
			usage: "<module-name>",
			fnName: "add",
			flags: {
				// "--config <path>": "Specify your config file.",
				// "--root <path>": "Specify your project root folder.",
			},
		},
		install: {
			desc: "pnpm add prod dependency to minecat project",
			usage: "<packages>",
			// file: "aba",
			fnName: "ada",
			alias: "i",
			flags: {
				// "--config1 <path>": "Specify your config file.",
				// "--root1 <path>": "Specify your project root folder.",
			},
		},
		run: {
			desc: "pnpm run script from current project",
			// file: "aba",
			fnName: "ada",
			alias: "r",
			flags: {
				// "--config1 <path>": "Specify your config file.",
				// "--root1 <path>": "Specify your project root folder.",
			},
		},
		config: {
			desc: "minecat custom template project config",
			usage: "<tpl_name> <repo_url>",
			// file: "aba",
			fnName: "ada",
			alias: "c",
			flags: {
				// "--config1 <path>": "Specify your config file.",
				// "--root1 <path>": "Specify your project root folder.",
			},
		},
		clear: {
			desc: "clear node_modules in pnpm workspaces",
			alias: "clean",
		},
	},
	flags: {
		"--verbose": "show log.",
		// "--root <path>": "Specify your project root folder.",
		// "--site <url>": "Specify your project site.",
	},
};
