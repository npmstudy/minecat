import prompts from "prompts";
import { dclone } from "dclone";
import shell from "shelljs";
import { homedir } from "os";
import debug from "debug";
import { colors } from "libargs";
import { extractGitHubRepoInfo, getDirectories, getConfig } from "../utils";

const log = debug("minecat");

export async function init(cmd) {
  const projectName =
    cmd.input["_"].length !== 0 ? cmd.input["_"][0] : "yourproject";

  const { url, promptInput } = await getParams(projectName);

  log(promptInput);

  if (promptInput.confirm) {
    log(promptInput.apptype);

    mkdirPkgHome(promptInput);

    const originPkgDir = getOriginPkgDir(url);

    // 以下根据获得的promptInput，来进行clone、目录、git等操作
    if (!shell.test("-d", originPkgDir)) {
      // 不存在originPkgDir，才可以执行下面的clone逻辑
      cloneAndCp(promptInput, url);

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
            `)
        )
      );
      console.dir("done");
    } else {
      console.dir("failed，dir is exist");
    }
  }
}

/**
 * @param promptInput
 */
export function mkdirPkgHome(promptInput) {
  const pkgHome = homedir + `/.minecat/` + promptInput.apptype + "/";
  shell.mkdir("-p", pkgHome);
}

/**
 * @param url
 */
export function getOriginPkgDir(url) {
  const { repoName } = getGitInfo(url);
  return process.cwd() + "/" + repoName + "/packages";
}

/**
 * @param projectName
 */
export async function getParams(projectName) {
  const cfgJson = getConfig();

  log(cfgJson);

  try {
    const questions: any = [
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
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }
}

/**
 * @param promptInput
 * @param url repo url
 */
export async function cloneAndCp(response, url) {
  const pkgHome = homedir + `/.minecat/` + response.apptype + "/";
  const { userName, repoName } = getGitInfo(url);
  const projectDir =  path.join(process.cwd() ,repoName);

  if (!shell.test("-d", pkgHome + repoName)) {
    await dclone({
      dir: "https://github.com/" + userName + "/" + repoName,
    });
  
    // 在windows 情况下，不能直接移动
    // 采用先创建，复制、删除的流程
    shell.mkdir('-p', pkgHome);
    shell.cp("-Rf", projectDir, pkgHome);
    shell.rm('-rf', projectDir);
  }

  // clone local dirname
  const cloneToLocalDir = path.join(process.cwd(), response.newname);

  shell.cp("-Rf", pkgHome + repoName, cloneToLocalDir);
}

//url =  cfgJson[response.apptype]
export function getGitInfo(url) {
  const { owner, name } = extractGitHubRepoInfo(url);

  let userName = owner;
  let repoName = name;

  if (!userName || !repoName) {
    console.dir("extractGitHubRepoInfo error, url=" + url);
    return;
  }

  return { userName, repoName };
}

/**
 * @param promptInput
 */
export function movePkgToCache(promptInput) {
  const pkgHome = homedir + `/.minecat/` + promptInput.apptype + "/";
  const cloneToLocalDir = process.cwd() + "/" + promptInput.newname;

  const pkgs = getDirectories(cloneToLocalDir + "/packages");
  for (const i in pkgs) {
    const pkg = pkgs[i];
    const pkgDir = path.join(cloneToLocalDir, "packages", pkg);

    shell.cp("-Rf", pkgDir, pkgHome);
    console.log("add module at " + pkgHome + pkg);
  }
}

/**
 * @param promptInput = response.newname
 */
export function resetGitInfo(promptInput) {
  const cloneToLocalDir = process.cwd() + "/" + promptInput.newname;

  // remove .git && git init & git config
  shell.rm("-rf", path.join(cloneToLocalDir, ".git"));

  // Run external tool synchronously
  if (shell.exec(`git config --global init.defaultBranch main`).code !== 0) {
    shell.echo("Error: git config --global init.defaultBranch main failed: ");
    shell.exit(1);
  }

  if (
    shell.exec(
      `cd ${promptInput.newname} && git init && git add . && git commit -am 'init'`
    ).code !== 0
  ) {
    shell.echo("Error: git config --global init.defaultBranch main failed: ");
    shell.exit(1);
  }
}
