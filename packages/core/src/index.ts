#!/usr/bin/env node
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import prompts from "prompts";
import { dclone } from "dclone";

export async function init() {
  yargs(hideBin(process.argv))
    .command(
      "init",
      "init a minecat project with pnpm",
      (yargs) => {
        // init project
        return yargs.positional("port", {
          describe: "port to bind on",
          default: 5000,
        });
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
            console.dir(response.apptype);

            if (response.apptype === "Node.js") {
              await dclone({
                dir: "https://github.com/npmstudy/your-node-v20-monoreopo-project",
              });

              console.dir("rm ");

              console.dir("done");
            }
          }
        } catch (cancelled: any) {
          console.log(cancelled.message);
          return;
        }
      }
    )
    .command(
      "module [port]",
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
