import { homedir } from "node:os";
import fs from "node:fs";
import path from "path"

export function getSafeHomeDir(): string {
  const home = path.join(homedir + `/.minecat`);
  if (!fs.existsSync(home)) {
    fs.mkdirSync(home);
    // writeConfig(DEFAULT_CONFIGS);
  }

  return home;
}

// 获取某个目录下面的所有文件夹
export const getDirectories = (source: string) => {
  return fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
};
