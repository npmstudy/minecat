# Your Node.js v20 Menoreopo Project

> A PNPM monorepo template for Node.js v20 projects.

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
然后初始化 pnpm project

支持模版

- Node.js
  - https://github.com/npmstudy/your-node-v20-monoreopo-project

步骤

- dclone https://github.com/npmstudy/your-node-v20-monoreopo-project
- mv your-node-v20-monoreopo-project/packages/* ~/.minecat/Node.js/


### 3、创建模块

```
$ minecat add
$ minecat add --list
$ minecat add --update
```

选择 Node.js/React
然后读 pnpm workspace 的配置，有 packages 就读，没有提示输入。

步骤

- 获取当前项目package.json minecat类型：Node.js/
- ls ~/.minecat/Node.js/
- mv lib to ./packages/xxx
- mv ~/.minecat/Node.js/xx ~/packages/xx

### 4、use 模块

```
$ minecat use abc

$ minecat dd debug //增加debug到abc模块的devdependency
$ minecat pd yargs // 增加yarg到abc模块的proddependency
$ minecat rd debug // 从abc模块，移除debug
```

## License

MIT @ npmstudy
