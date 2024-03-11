import { describe, it, vi } from "vitest";
import { setupTmpDir } from "../test-utils";
import type { TmpDirContext } from "../test-utils";
import clear from "../../cmd/clear";
import type { Command } from "libargs";
import fs from "node:fs/promises";

describe("cmd/clear.ts", () => {
	setupTmpDir();

	it<TmpDirContext>("should clear node_modules for two subpackages and the root repo", async ({
		maker,
		r,
	}) => {
		const fsSpy = vi.spyOn(fs, "rmdir");
		const logSpy = vi.spyOn(console, "log");

		await maker.makeFile(
			r("pnpm-workspace.yaml"),
			`
packages:
  - 'aaa'
  - 'bbb'

`,
		);

		await maker.makePackageJson(r(), { name: "monorepo" });
		await maker.makePackageJson("./aaa", { name: "aaa" });
		await maker.makePackageJson("./bbb", { name: "bbb" });

		await maker.makeFile(
			r("./node_modules/mono-pkg.js"),
			`console.log('im here!')`,
		);
		await maker.makeFile(
			r("./bbb/node_modules/a-pkg.js"),
			`console.log('im here!')`,
		);
		await maker.makeFile(
			r("./aaa/node_modules/a-pkg.js"),
			`console.log('im here!')`,
		);

		await clear({} as Command, r());

		expect(fsSpy).toHaveBeenCalledTimes(3);
		expect(logSpy).toHaveBeenCalled();
	});

	it<TmpDirContext>("should will do nothing if no packages found", async ({
		r,
	}) => {
		const fsSpy = vi.spyOn(fs, "rmdir");
		const logSpy = vi.spyOn(console, "log");

		await clear({} as Command, r());

		expect(fsSpy).toHaveBeenCalledTimes(0);

		// if no packages, log will warn once
		expect(logSpy).toHaveBeenCalledTimes(1);
	});
});
