import path from "node:path";
import type { DirectoryResult } from "tmp-promise";
import type { TestContext } from "vitest";
import { beforeEach, afterEach } from "vitest";
import { dir } from "tmp-promise";
import fsx from "fs-extra";
import type { PackageJson, TsConfigJson } from "type-fest";

export interface TmpDirContext {
	tmp: DirectoryResult;
	r: (p?: string) => string;
	maker: {
		makePackageJson: (p: string, options: PackageJson) => Promise<string>;
		makeTsConfig: (p: string, options: TsConfigJson) => Promise<string>;
		makeFile: (p: string, content: string) => Promise<string>;
		makeDir: (p: string) => Promise<string>;
	};
}

export const setupTmpDir = (options?: {
	before?: (ctx: TestContext & TmpDirContext) => Promise<void>;
	after?: (ctx: TestContext & TmpDirContext) => Promise<void>;
}) => {
	beforeEach<TmpDirContext>(async (context) => {
		const result = await dir();
		context.tmp = result;
		context.r = (p?: string) =>
			p ? path.resolve(result.path, p) : result.path;
		context.maker = {
			makePackageJson: async (relativePath, options) => {
				const filename = context.r(
					path.join(relativePath || "", "./package.json"),
				);
				await fsx.outputJSON(filename, options);
				return filename;
			},
			makeTsConfig: async (
				relativePath,
				options: TsConfigJson = {
					compilerOptions: {
						module: "ESNext",
						target: "ESNext",
						moduleResolution: "Node",
					},
				},
			) => {
				const filename = context.r(
					path.join(relativePath || "", "./tsconfig.json"),
				);
				await fsx.outputJSON(filename, options);
				return filename;
			},
			makeFile: async (p, content) => {
				await fsx.outputFile(p, content, "utf-8");
				return p;
			},
			makeDir: async (dirname: string) => {
				await fsx.ensureDir(dirname);
				return dirname;
			},
		} as TmpDirContext["maker"];
		await options?.before?.(context);
	});

	afterEach<TmpDirContext>(async (context) => {
		await fsx.emptyDir(context.tmp.path);
		context.tmp.cleanup();
		context.r = () => "";
		await options?.after?.(context);
	});
};
