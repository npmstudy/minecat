import { findWorkspacePackages } from "@pnpm/workspace.find-packages";
import path from "node:path";
import { existsSync } from "node:fs";
// import { rmdir } from "node:fs/promises";
import fs from "node:fs/promises";

import type { Command } from "libargs";
import { colors } from "libargs";

export default async (_: Command, cwd: string = process.cwd()) => {
	const packages = await findWorkspacePackages(cwd);

	if (packages.length === 0) {
		console.log(colors.red(colors.bold("No package found!")));
		return;
	}

	const packageString = packages.map((o) => `[${o.manifest.name}]`).join(", ");

	console.log(
		colors.cyan(
			colors.bold(`Start clearing node_modules in ${packageString}...`),
		),
	);

	const packagePaths = packages.map((o) =>
		path.resolve(o.dir, "./node_modules"),
	);

	const tasks = packagePaths
		.filter((p) => existsSync(p))
		.map((p) => {
			return fs.rmdir(p, { recursive: true });
		});

	await Promise.all(tasks);

	console.log(
		colors.green(colors.bold(`Cleared node_modules in ${packageString}!`)),
	);
};
