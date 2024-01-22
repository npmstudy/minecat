#!/usr/bin/env node
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import prompts from "prompts";
import { dclone } from "dclone";
import fs, { readdirSync } from "fs";
import shell from "shelljs";
import { homedir } from "os";
import debug from "debug";

const log = debug("minecat");
let proj_type;
let pkg_list = {};
let pkg_names = [];

// 获取某个目录下面的所有文件夹
const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

export async function init() {
  try {
    const json = JSON.parse(
      fs.readFileSync(process.cwd() + "/package.json").toString()
    );
    if (!json.minecat) {
      console.log("please check this is a minecat project");
      return;
    } else {
      proj_type = json.minecat.type;
      console.log("this is a minecat project with type = " + json.minecat.type);

      const originPkgDir = process.cwd() + "/packages";

      const pkgs = getDirectories(originPkgDir);

      log(pkgs);

      // mv pkg to ~/.minecat/Node.js/xxx
      for (const i in pkgs) {
        const json = JSON.parse(
          fs
            .readFileSync(
              process.cwd() + "/packages/" + pkgs[i] + "/package.json"
            )
            .toString()
        );

        pkg_list[json.name] = json;
      }
      pkg_names = Object.keys(pkg_list);
    }
  } catch (e) {
    console.error(e);
  }

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
        // console.log(argv.port);
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
      "add [tpl] [newname]",
      "add a module in project",
      (yargs) => {
        // add module in project
        return yargs
          .positional("tpl", {
            describe: "template to use",
          })
          .positional("newname", {
            describe: "to destination dir",
          });
      },
      (argv) => {
        // if (argv.verbose) console.info(`start server on :${argv.port}`);

        console.dir(proj_type);
        if (!proj_type) {
          console.dir("当前不是minecat项目，或者没有在项目根目录");
          return;
        }

        const pkgHome = homedir + `/.minecat/` + proj_type + "/";
        const pkgs = getDirectories(pkgHome);
        // shell.ls("-alt", pkgHome);

        console.log(pkgs);

        if (!argv["tpl"]) {
          console.log("please input tpl name");
          return;
        }

        if (!argv["newname"]) {
          argv["newname"] = argv["tpl"];
        }
        // 先判断newname是否存在

        console.dir(
          "cp from " +
            pkgHome +
            argv["tpl"] +
            " to " +
            process.cwd() +
            "/packages/" +
            argv["newname"]
        );
        // 如果newname不存在，就拷贝tpl到newname
        shell.cp(
          "-Rf",
          pkgHome + "/" + argv["tpl"],
          process.cwd() + "/packages/" + argv["newname"]
        );
        // 修改package.json里的名字。
      }
    )
    .command(
      "i [package]",
      "pnpm add prod dependency to current project",
      (yargs) => {
        // minecat pd yargs // 增加yarg到abc模块的proddependency
        return yargs.positional("package", {
          describe: "port to bind on",
          default: 5000,
        });
      },
      async (argv) => {
        // if (argv.verbose) console.info(`start server on :${argv.port}`);
        // if (argv.verbose) console.dir(proj_type);
        if (!proj_type) {
          console.dir("当前不是minecat项目，或者没有在项目根目录");
          return;
        }

        if (argv.verbose) console.dir("pkg names=" + pkg_names);

        if (argv._[0] === "i" || argv._[0] === "install") {
          // if (argv.verbose) console.log(argv);
          // 移除 i 或 install
          const pkgs = argv._.shift();
          argv._.push(argv.package);
          const depts = argv._;
          if (argv.verbose) console.log("install packages: " + depts);

          let pgk_choices = [];
          for (var i in pkg_names) {
            let name = pkg_names[i];
            pgk_choices.push({ title: name, value: name });
          }

          try {
            const questions: any = [
              {
                type: "select",
                name: "pkgname",
                message: "What is your package name?",
                choices: pgk_choices,
              },
              {
                type: "select",
                name: "dependencytype",
                message: "What is your dependency type?",
                choices: [
                  { title: "prod dependency", value: "proddependency" },
                  { title: "dev dependency", value: "devdependency" },
                ],
              },
              {
                type: "confirm",
                name: "confirm",
                initial: true,
                message: (prev, values) => `Please confirm ?`,
              },
            ];
            const response = await prompts(questions);

            // => { value: 24 }

            if (response.confirm) {
              if (argv.verbose) console.log(response);
              const dept_type =
                response.dependencytype === "proddependency" ? "-P" : "-D";

              const cmd = `pnpm add ${depts.join(" ")} --filter ${
                response.pkgname
              } ${dept_type}`;
              if (argv.verbose) console.dir(cmd);

              // Run external tool synchronously
              if (shell.exec(cmd).code !== 0) {
                shell.echo("Error: pnpm add failed: " + cmd);
                shell.exit(1);
              }
            }
          } catch (cancelled: any) {
            console.log(cancelled.message);
            return;
          }
        }
      }
    )
    .command(
      "r [package]",
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
      "run [package]",
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
    .help()
    .parse();
}

init().catch((e) => {
  console.error(e);
});
