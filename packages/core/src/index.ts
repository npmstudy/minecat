#!/usr/bin/env node
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import prompts from "prompts";
import { dclone } from "dclone";
import { readdirSync } from "fs";
import shell from "shelljs";
import { homedir } from "os";
import debug from "debug";

const log = debug("minecat");

export async function init() {
  yargs(hideBin(process.argv))
    .command(
      "init",
      "init a minecat project with pnpm",
      (yargs) => {
        // init project
        return;
      },
      async (argv) => {
        if (argv.verbose) console.info(`start server on :${argv.port}`);
        console.log(argv.port);
        try {
          const questions: any = [
            {
              type: "select",
              name: "apptype",
              message: "What is your project type?",
              choices: [
                { title: "Node.js", value: "Node.js" },
                { title: "React", value: "React" },
              ],
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

          // console.log(response); // => { value: 24 }

          if (response.confirm) {
            log(response.apptype);
            const userName = "npmstudy";
            const repoName = "your-node-v20-monoreopo-project";
            const pkgHome = homedir + `/.minecat/` + response.apptype + "/";
            shell.mkdir("-p", pkgHome);

            const projectDir = process.cwd() + "/" + repoName;
            const originPkgDir = projectDir + "/packages";
            if (response.apptype === "Node.js") {
              if (!shell.test("-d", originPkgDir)) {
                // 不存在originPkgDir，才可以执行下面的clone逻辑
                await dclone({
                  dir: "https://github.com/" + userName + "/" + repoName,
                });

                // 获取某个目录下面的所有文件夹
                const getDirectories = (source) =>
                  readdirSync(source, { withFileTypes: true })
                    .filter((dirent) => dirent.isDirectory())
                    .map((dirent) => dirent.name);

                const pkgs = getDirectories(originPkgDir);

                log(pkgs);

                // mv pkg to ~/.minecat/Node.js/xxx
                for (const i in pkgs) {
                  const pkg = pkgs[i];
                  const pkgDir = originPkgDir + "/" + pkg;

                  shell.mv("-f", pkgDir, pkgHome);
                  console.log("add module at " + pkgHome + pkg);
                }

                shell.rm("-rf", projectDir + "/.git");

                console.dir("congratulations");
              } else {
                console.dir("failed，dir is exist");
              }
            }
          }
        } catch (cancelled: any) {
          console.log(cancelled.message);
          return;
        }
      }
    )
    .command(
      "add [port]",
      "add a module in project",
      (yargs) => {
        // add module in project
        return yargs.positional("port", {
          describe: "port to bind on",
          default: 5000,
        });
      },
      (argv) => {
        if (argv.verbose) console.info(`start server on :${argv.port}`);
        console.log(argv.port);
      }
    )
    .command(
      "use [port]",
      "change context to this project",
      (yargs) => {
        // minecat use abc，切换当前模块为abc
        return yargs.positional("port", {
          describe: "port to bind on",
          default: 5000,
        });
      },
      (argv) => {
        if (argv.verbose) console.info(`start server on :${argv.port}`);
        console.log(argv.port);
      }
    )
    .command(
      "pd [port]",
      "pnpm add prod dependency to current project",
      (yargs) => {
        // minecat pd yargs // 增加yarg到abc模块的proddependency
        return yargs.positional("port", {
          describe: "port to bind on",
          default: 5000,
        });
      },
      (argv) => {
        if (argv.verbose) console.info(`start server on :${argv.port}`);
        console.log(argv.port);
      }
    )
    .command(
      "dd [port]",
      "pnpm add dev dependency to current project",
      (yargs) => {
        // minecat dd debug //增加debug到abc模块的devdependency
        return yargs.positional("port", {
          describe: "port to bind on",
          default: 5000,
        });
      },
      (argv) => {
        if (argv.verbose) console.info(`start server on :${argv.port}`);
        console.log(argv.port);
      }
    )
    .command(
      "rd [port]",
      "pnpm remove prod|dev dependency from current project",
      (yargs) => {
        // 从abc模块，移除debug
        return yargs.positional("port", {
          describe: "port to bind on",
          default: 5000,
        });
      },
      (argv) => {
        if (argv.verbose) console.info(`start server on :${argv.port}`);
        console.log(argv.port);
      }
    )
    .option("verbose", {
      alias: "v",
      type: "boolean",
      description: "Run with verbose logging",
    })
    .parse();
}

init().catch((e) => {
  console.error(e);
});
