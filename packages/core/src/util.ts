import fs from "node:fs";
import { homedir } from "node:os";
import shell from "shelljs";

export function extractGitHubRepoInfo(url: string) {
  if (!url) return null;
  const match = url.match(
    /^https?:\/\/(www\.)?github.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+)/
  );
  if (!match || !(match.groups?.owner && match.groups?.name)) return null;
  return { owner: match.groups.owner, name: match.groups.name };
}

export function getSafeHome(): string {
  const home = homedir + `/.minecat`;
  if (!shell.test("-d", home)) {
    shell.mkdir("-p", home);
  }

  return home;
}

export function getConfigFile(): string {
  return getSafeHome() + `/config.json`;
}

export function getConfig() {
  const configFile = getConfigFile();

  try {
    JSON.parse(fs.readFileSync(configFile).toString());
  } catch (error) {
    throw error;
  }
}

export async function writeConfig(cfg) {
  const configFile = getConfigFile();

  try {
    fs.writeFileSync(configFile, JSON.stringify(cfg, null, 4));
  } catch (error) {
    console.dir(error);
  }
}
