import prompts from "prompts";
import { dclone } from "dclone";
import shell from "shelljs";
import { homedir } from "os";
import debug from "debug";
import { colors } from "libargs";
import path from "path"; 
import { extractGitHubRepoInfo } from "../util";
import { getDirectories, getConfig } from "../util";

const log = debug("minecat");

export async function init(cmd) {
  const projectName =
    cmd.input["_"].length !== 0 ? cmd.input["_"][0] : "yourproject";

  const cfgJson = getConfig();

  log(cfgJson);

  // await process(cfgJson);
  const appChoices = Object.keys(cfgJson).map((x) => {
    return { title: x, value: x };
  });

  try {
    const questions: any = [
      {
        type: "select",
        name: "apptype",
        message: "What is your project type?",

        choices: appChoices,
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

    const response = await prompts(questions);

    log(response);

    if (response.confirm) {
      log(response.apptype);

      const url = cfgJson[response.apptype];
      const { userName, repoName } = getGitInfo(url);

      const pkgHome = path.join(homedir(), '.minecat', response.apptype, '/');

      shell.mkdir("-p", pkgHome);

      const projectDir = path.join(process.cwd(), repoName);
      const originPkgDir = path.join(projectDir, "packages");      

      //----------
      if (!shell.test("-d", originPkgDir)) {
        // 不存在originPkgDir，才可以执行下面的clone逻辑
        await cloneAndCp(response, url);

        // mv pkg to ~/.minecat/Node.js/xxx
        movePkgToCache(response);

        // remove .git && git init & git config
        resetGitInfo(response.newname);

        // log usages
        console.log(
          colors.red(
            colors.bold(`
              -----------------------------------------
              Usages: cd ${response.newname} && pnpm i && pnpm dev
              -----------------------------------------
            `)
          )
        );
        console.dir("done");
      } else {
        console.dir("failed，dir is exist");
      }
    }
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }
}

/**
 * @param promptInput
 * @param url repo url
 */
async function cloneAndCp(response, url) {
  const pkgHome = path.join(homedir(), '.minecat', response.apptype, '/');
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
function getGitInfo(url) {
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
function movePkgToCache(promptInput) {
  
  const pkgHome = path.join(homedir(), '.minecat', promptInput.apptype,'/');
  const cloneToLocalDir = path.join(process.cwd(), promptInput.newname);
  const pkgs = getDirectories(path.join(cloneToLocalDir, "packages"));

  for (const i in pkgs) {
    const pkg = pkgs[i];
    const pkgDir = path.join(cloneToLocalDir, "packages", pkg);

    shell.cp("-Rf", pkgDir, pkgHome);
    console.log("add module at " + pkgHome + pkg);
  }
}

/**
 * @param newdir = response.newname
 */
function resetGitInfo(newdir) {
  const cloneToLocalDir = path.join(process.cwd(), newdir);

  // remove .git && git init & git config
  shell.rm("-rf", path.join(cloneToLocalDir, ".git"));

  // Run external tool synchronously
  if (shell.exec(`git config --global init.defaultBranch main`).code !== 0) {
    shell.echo("Error: git config --global init.defaultBranch main failed: ");
    shell.exit(1);
  }

  if (
    shell.exec(`cd ${newdir} && git init && git add . && git commit -am 'init'`)
      .code !== 0
  ) {
    shell.echo("Error: git config --global init.defaultBranch main failed: ");
    shell.exit(1);
  }
}
