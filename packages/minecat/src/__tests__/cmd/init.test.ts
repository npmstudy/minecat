import { describe, expect, it, vi } from "vitest";
import { getGitInfo } from "../../cmd/init";

describe("cmd/init", () => {
  it("should getGitInfo()", () => {
    const { userName, repoName } = getGitInfo(
      "https://github.com/npmstudy/your-node-v20-monoreopo-project"
    );

    expect(userName).toBe("npmstudy");
    expect(repoName).toBe("your-node-v20-monoreopo-project");
  });

  it("should getGitInfo()", () => {
    const { userName, repoName } = getGitInfo(
      "https://github.com/npmstudy/your-node-v20-monoreopo-project"
    );

    expect(userName).toBe("npmstudy");
    expect(repoName).toBe("your-node-v20-monoreopo-project");
  });
});
