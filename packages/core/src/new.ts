#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

yargs(hideBin(process.argv))
  .command(
    "serve [port]",
    "start the server",
    (yargs) => {
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
    "init [port]",
    "start the server",
    (yargs) => {
      // init project
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
    "module [port]",
    "start the server",
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
    "start the server",
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
    "start the server",
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
    "start the server",
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
    "start the server",
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
