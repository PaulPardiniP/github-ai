import type { GitHubClient } from "../utils/types.js";

export function makeGitHubOperations(github: GitHubClient) {
  return {

    async listRepositories() {
      const response = await github.request("GET /user/repos", {
        type: "all",
        sort: "updated",
      });

      return response.data;
    },

    async createRepository(name: string, description?: string) {
      const response = await github.request("POST /user/repos", {
        name,
        description,
      });

      return response.data;
    },

    async createIssue(
      owner: string,
      repo: string,
      title: string,
      body?: string
    ) {
      const response = await github.request(
        "POST /repos/{owner}/{repo}/issues",
        {
          owner,
          repo,
          title,
          body,
        }
      );

      return response.data;
    },

    async listIssues(owner: string, repo: string) {
      const response = await github.request(
        "GET /repos/{owner}/{repo}/issues",
        {
          owner,
          repo,
          state: "open",
        }
      );

      return response.data;
    },
  };
}