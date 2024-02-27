import prompts from "prompts";
import debug from "debug";
import { homedir } from "os";
import fs, { readdirSync } from "fs";
import shell from "shelljs";

const log = debug("minecat");

// 获取某个目录下面的所有文件夹
const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

let proj_type;
let proj_package_json;
let proj_script_names;
let pkg_list = {};
let pkg_names = [];
export async function ada(cmd) {
  if (cmd.input["_"].length === 0) {
    return cmd.help();
  }

  const moduleName =
    cmd.input["_"].length !== 0 ? cmd.input["_"][0] : "yourproject";

  try {
    const json = JSON.parse(
      fs.readFileSync(process.cwd() + "/package.json").toString()
    );
    if (!json.minecat) {
      console.log("please check this is a minecat project");
      return;
    } else {
      proj_package_json = json;
      proj_type = json.minecat.type;
      proj_script_names = Object.keys(json.scripts);
      // console.dir(proj_script_names);
      log("this is a minecat project with type = " + json.minecat.type);

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

  const pkgHome = homedir + `/.minecat/` + proj_type + "/";
  const pkgs = getDirectories(pkgHome);

  if (!proj_type) {
    console.dir("当前不是minecat项目，或者没有在项目根目录");
    return;
  }

  // console.dir(cmd);

  // if (flags?.help || flags?.h) {
  if (cmd.verbose) console.dir("pkg names=" + pkg_names);

  // if (argv.verbose) console.log(argv);
  // 移除 i 或 install
  // const pkgs = argv._.shift();
  // argv._.push(argv.package);
  const depts = cmd.input._;

  if (cmd.verbose) console.log("install packages: " + depts);

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

    if (response.confirm) {
      // if (cmd.verbose) console.log(response);
      const dept_type =
        response.dependencytype === "proddependency" ? "-P" : "-D";

      const cmd = `npx pnpm add ${depts.join(" ")} --filter ${
        response.pkgname
      } ${dept_type}`;
      // if (cmd.verbose) console.dir(cmd);

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

  console.dir("done!");
  // console.dir(flags);
}
