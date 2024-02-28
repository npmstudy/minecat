import prompts from "prompts";
import { dclone } from "dclone";
import shell from "shelljs";
import { homedir } from "os";
import debug from "debug";
import { colors } from "libargs";
import { extractGitHubRepoInfo } from "../util";
import { getDirectories, getConfig } from "../util";

const log = debug("minecat");

let cfgJson;
export async function init(cmd) {
  const projectName =
    cmd.input["_"].length !== 0 ? cmd.input["_"][0] : "yourproject";

  try {
    cfgJson = getConfig();
  } catch (error) {
    console.dir(error);
  }
console.log(cfgJson);

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

      const { owner, name } = extractGitHubRepoInfo(cfgJson[response.apptype]);

      let userName = owner;
      let repoName = name;

      if (!userName || !repoName) {
        console.dir(
          "extractGitHubRepoInfo error, url=" + cfgJson[response.apptype]
        );
        return;
      }

      const pkgHome = homedir + `/.minecat/` + response.apptype + "/";
      shell.mkdir("-p", pkgHome);

      const projectDir = process.cwd() + "/" + repoName;
      const originPkgDir = projectDir + "/packages";

      //----------
      if (!shell.test("-d", originPkgDir)) {
        // 不存在originPkgDir，才可以执行下面的clone逻辑

        if (!shell.test("-d", pkgHome + repoName)) {
          await dclone({
            dir: "https://github.com/" + userName + "/" + repoName,
          });

          shell.mv("-f", projectDir, pkgHome);
        }
        const newname = process.cwd() + "/" + response.newname;

        shell.cp("-Rf", pkgHome + repoName, newname);

        const pkgs = getDirectories(newname + "/packages");

        // console.log(pkgs);

        // mv pkg to ~/.minecat/Node.js/xxx
        for (const i in pkgs) {
          const pkg = pkgs[i];
          const pkgDir = newname + "/packages/" + pkg;

          shell.cp("-Rf", pkgDir, pkgHome);
          console.log("add module at " + pkgHome + pkg);
        }

        shell.rm("-rf", newname + "/.git");

        // Run external tool synchronously
        if (
          shell.exec(`git config --global init.defaultBranch main`).code !== 0
        ) {
          shell.echo(
            "Error: git config --global init.defaultBranch main failed: "
          );
          shell.exit(1);
        }

        if (
          shell.exec(
            `cd ${response.newname} && git init && git add . && git commit -am 'init'`
          ).code !== 0
        ) {
          shell.echo(
            "Error: git config --global init.defaultBranch main failed: "
          );
          shell.exit(1);
        }
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
