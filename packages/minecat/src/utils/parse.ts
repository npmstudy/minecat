export function extractGitHubRepoInfo(url: string) {
  if (!url) return null;
  const match = url.match(
    /^https?:\/\/(www\.)?github.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+)/,
  );
  if (!match || !(match.groups?.owner && match.groups?.name)) return null;
  return { owner: match.groups.owner, name: match.groups.name };
}
