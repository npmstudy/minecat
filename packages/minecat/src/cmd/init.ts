import prompts from "prompts";
import type { PromptObject } from "prompts";
import { dclone } from "dclone";
import shell from "shelljs";
import os from "node:os";
import debug from "debug";
import { colors } from "libargs";
import { extractGitHubRepoInfo, getDirectories, getConfig } from "../utils";
import path from "node:path";
import fs from "node:fs";

const log = debug("minecat");

export async function init(cmd) {
	const projectName = cmd.input._.length !== 0 ? cmd.input._[0] : "yourproject";

	const { url, promptInput } = await getParams(projectName);

	log(promptInput);

	if (promptInput.confirm) {
		mkdirPkgHome(promptInput);

		const originPkgDir = getOriginPkgDir(url);

		log(originPkgDir);

		try {
			// 以下根据获得的promptInput，来进行clone、目录、git等操作
			if (!shell.test("-d", originPkgDir)) {
				// 不存在originPkgDir，才可以执行下面的clone逻辑
				await cloneAndCp(promptInput, url);

				// mv pkg to ~/.minecat/Node.js/xxx
				movePkgToCache(promptInput);

				// remove .git && git init & git config
				resetGitInfo(promptInput);

				// log usages
				console.log(
					colors.red(
						colors.bold(`
              -----------------------------------------
              Usages: cd ${promptInput.newname} && pnpm i && pnpm dev
              -----------------------------------------
            `),
					),
				);
				console.dir("done");
			} else {
				console.dir("failed，dir is exist");
			}
		} catch (error) {
			// console.dir(error);
		}
	}
}

/**
 * @param promptInput
 * Testd
 */
export function mkdirPkgHome(promptInput) {
	const pkgHome = path.join(
		os.homedir(),
		".minecat",
		`${promptInput.apptype}/`,
	);

	shell.mkdir("-p", pkgHome);
}

/**
 * @param url
 * Testd
 */
export function getOriginPkgDir(url) {
	const { repoName } = getGitInfo(url);
	return path.join(process.cwd(), repoName, "packages");
}

/**
 * @param projectName
 * Testd
 */
export async function getParams(projectName) {
	const cfgJson = getConfig();

	log(cfgJson);

	try {
		const questions: PromptObject[] = [
			{
				type: "select",
				name: "apptype",
				message: "What is your project type?",
				choices: Object.keys(cfgJson).map((x) => {
					return { title: x, value: x };
				}),
			},
			{
				type: "text",
				name: "newname",
				initial: projectName,
				message: "What is the name of your new project?",
			},
			{
				type: "confirm",
				name: "confirm",
				initial: true,
				message: (prev, values) =>
					`Please confirm that you choose ${prev} to init project in current directory?`,
			},
		];

		const promptInput = await prompts(questions);
		const url = cfgJson[promptInput.apptype];

		return { url, promptInput };
	} catch (cancelled) {
		console.log(cancelled.message);
		return;
	}
}

function safeMkdir(dirname: string) {
	if (!fs.existsSync(dirname)) {
		fs.mkdirSync(dirname, { recursive: true });
	}
}

/**
 * @param promptInput
 * @param url repo url
 */
export async function cloneAndCp(promptInput, url) {
	log("promptInput = ");
	log(promptInput);

	const pkgHome = path.join(os.homedir(), ".minecat", promptInput.apptype, "/");
	safeMkdir(pkgHome);

	log(`pkgHome = ${pkgHome}`);

	const { userName, repoName } = getGitInfo(url);
	log(`userName = ${userName}`);
	log(`repoName = ${repoName}`);

	const projectDir = path.join(process.cwd(), repoName);

	try {
		safeMkdir(projectDir);
		// 如果~/.minecat/apptype/repoName不存在，就dcone
		if (!shell.test("-d", pkgHome + repoName)) {
			log("如果~/.minecat/apptype/repoName不存在，就dcone");
			await dclone({
				dir: `https://github.com/${userName}/${repoName}`,
			});

			// 在windows 情况下，不能直接移动
			// 采用先创建，复制、删除的流程
			shell.cp("-Rf", projectDir, pkgHome);
			log(`cp projectDir = ${projectDir}`);
			log(`cp pkgHome = ${pkgHome}`);
			shell.rm("-rf", projectDir);
		}

		// 如果~/.minecat/apptype/repoName存在，就走本地缓存
		// clone local dirname
		log("clone local dirname");
		const cloneToLocalDir = path.join(process.cwd(), promptInput.newname);

		log(`cloneToLocalDir before=${pkgHome}${repoName}`);
		log(`cloneToLocalDir=${cloneToLocalDir}`);

		// 移动
		shell.cp("-Rf", pkgHome + repoName, cloneToLocalDir);
	} catch (error) {
		console.dir(error);
	}
}

//url =  cfgJson[response.apptype]
export function getGitInfo(url: string) {
	const { owner, name } = extractGitHubRepoInfo(url);

	const userName = owner;
	const repoName = name;

	if (!userName || !repoName) {
		console.dir(`extractGitHubRepoInfo error, url=${url}`);
		return;
	}

	return { userName, repoName };
}

/**
 * @param promptInput
 */
export function movePkgToCache(promptInput) {
	const pkgHome = path.join(os.homedir(), ".minecat", promptInput.apptype, "/");
	const cloneToLocalDir = path.join(process.cwd(), promptInput.newname);

	const pkgs = getDirectories(`${cloneToLocalDir}/packages`);
	for (const i in pkgs) {
		const pkg = pkgs[i];
		const pkgDir = path.join(cloneToLocalDir, "packages", pkg);

		shell.cp("-Rf", pkgDir, pkgHome);
		console.log(`add module at ${pkgHome}${pkg}`);
	}
}

/**
 * @param promptInput = response.newname
 */
export function resetGitInfo(promptInput) {
	const cloneToLocalDir = path.join(process.cwd(), promptInput.newname);

	// remove .git && git init & git config
	shell.rm("-rf", path.join(cloneToLocalDir, ".git"));

	// Run external tool synchronously
	try {
		shell.exec("git config --global init.defaultBranch main");

		if (
			shell.exec(
				`cd ${cloneToLocalDir} && git init && git add . && git commit -am 'init'`,
			).code !== 0
		) {
			shell.echo("Error: git config --global init.defaultBranch main failed: ");
			shell.exit(1);
		}
	} catch (error) {
		console.dir(error);
	}
}
