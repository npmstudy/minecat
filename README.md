# Your Node.js v20 Menoreopo Project

> A PNPM monorepo template for Node.js v20 projects.

## What is in this repository?

- [Tsup](https://tsup.egoist.dev/) as a TypeScript universal package.
- [Tsx](https://github.com/esbuild-kit/tsx) as a Node.js enhanced with esbuild to run TypeScript & ESM
- [Tsdoc](https://tsdoc.org/) as document
- [PNPM](https://pnpm.io/workspaces) as workspace manager and package manager.
- [Vitest](https://vitest.dev/) as a test runner，as type test instead of tsd
- [Size Limit](https://github.com/ai/size-limit) as a size limit plugin.
- [Prettier](https://prettier.io/) as a code formatter.
- [ESLint](https://eslint.org/) as a code linter.
- [NX](https://nx.dev) as cacheable operations.
- [Changesets](https://github.com/changesets/changesets/) as a way to manage changes and releases.
- [@vitest/coverage-v8
](https://www.npmjs.com/package/@vitest/coverage-v8
) as coverage
- [supertest](https://www.npmjs.com/package/supertest) as server test
- [cypress](https://www.cypress.io/) as e2e test


## Using this repository

- clone the repository or click in "Use this template" button.
- copy `packages/lib` to `packages/yourlib`
 and edit the `name`, `description` and `author` fields.

## Folder structure

- docs - An empty folder to store documentation.
- example - A folder with an example project. Think as playground.
- packages/* - A folder with a library.

## Using Turbo to run commands

NX is a cacheable build tool (and Monorepo manager). This project uses it to run the `build`, `test` and `coverage` commands.

```bash
# Instead of running `pnpm build`, run:
nx run-many -t build
```

## Usage

### 1、打印信息和帮助

```
$ minecat
```

### 2、创建项目

```
$ minecat init
```

选择 Node.js/React
然后初始化 pnpm

### 3、创建模块

```
$ minecat module
$ minecat module --list
```

选择 Node.js/React
然后读 pnpm workspace 的配置，有 packages 就读，没有提示输入。

### 4、use 模块

```
$ minecat use abc

$ minecat dd debug //增加debug到abc模块的devdependency
$ minecat pd yargs // 增加yarg到abc模块的proddependency
$ minecat rd debug // 从abc模块，移除debug
```



## License

MIT @ npmstudy
