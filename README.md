# Your Node.js v20 Menoreopo Project

> A PNPM monorepo template for Node.js v20 projects.

## Usage

```
minecat [命令]

命令：
minecat init init a minecat project with pnpm
minecat add [tpl] [newname] add a module in project
minecat install [package] pnpm add prod dependency to current project
minecat run [script] pnpm run script from current project

选项：
--version 显示版本号 [布尔]
-v, --verbose Run with verbose logging [布尔]
--help 显示帮助信息 [布尔]
```

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
$ minecat add lib yourdir
```

选择 Node.js/React
然后读 pnpm workspace 的配置，有 packages 就读，没有提示输入。

步骤

- 获取当前项目package.json minecat类型：Node.js/
- ls ~/.minecat/Node.js/
- mv lib to ./packages/xxx
- mv ~/.minecat/Node.js/xx ~/packages/xx

### 4、安装模块

```
$ minecat install debug ms
```

选择当前packages/xxx包
选择是prod还是dev依赖


### 5、自定义模版

为了方便自定义模版，增加minecat config子命令，用法如下。

```
$ minecat config --list
{
  'Node.js': 'https://github.com/npmstudy/your-node-v20-monoreopo-project',
  React: 'https://github.com/npmstudy/your-vite-react-monoreopo-project',
}
$ minecat config vue https://github.com/npmstudy/your-node-v20-monoreopo-project
{
  'Node.js': 'https://github.com/npmstudy/your-node-v20-monoreopo-project',
  React: 'https://github.com/npmstudy/your-vite-react-monoreopo-project',
  vue: 'https://github.com/npmstudy/your-node-v20-monoreopo-project',
}

```

## License

MIT @ npmstudy
