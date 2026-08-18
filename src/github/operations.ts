import type { GitHubClient } from "../utils/types.js";
import { withRetry } from "../utils/retry.js";

export function makeGitHubOperations(github: GitHubClient) {

  // Todas las llamadas a GitHub pasan por retry
  const requestWithRetry = (
    route: string,
    options?: Record<string, unknown>
  ) => {
    return withRetry(() => github.request(route, options));
  };

  return {

    // Lista los repositorios del usuario autenticado
async listRepositories(
  type: "all" | "owner" | "public" | "private" | "member" = "all",
  sort: "created" | "updated" | "pushed" | "full_name" = "updated"
) {
  const response = await requestWithRetry("GET /user/repos", {
    type,
    sort,
  });

  return response.data;
},

    // Crea un repositorio
    async createRepository(name: string, description?: string) {
      const response = await requestWithRetry("POST /user/repos", {
        name,
        description,
      });

      return response.data;
    },

    // Crea un issue
    async createIssue(
      owner: string,
      repo: string,
      title: string,
      body?: string
    ) {
      const response = await requestWithRetry(
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

    // Lista issues abiertos
    async listIssues(owner: string, repo: string) {
      const response = await requestWithRetry(
        "GET /repos/{owner}/{repo}/issues",
        {
          owner,
          repo,
          state: "open",
        }
      );

      return response.data;
    },

    // Crea o modifica un archivo y genera un commit
    async createCommit(
      owner: string,
      repo: string,
      branch: string,
      filePath: string,
      fileContent: string,
      commitMessage: string
    ) {

      // 1. Obtener la ref actual de la rama
      const refResp = await requestWithRetry(
        "GET /repos/{owner}/{repo}/git/ref/heads/{branch}",
        {
          owner,
          repo,
          branch,
        }
      );

      const refData = refResp.data as {
        object: { sha: string };
      };

      const baseCommitSha = refData.object.sha;


      // 2. Obtener el tree del commit actual
      const baseCommitResp = await requestWithRetry(
        "GET /repos/{owner}/{repo}/git/commits/{commit_sha}",
        {
          owner,
          repo,
          commit_sha: baseCommitSha,
        }
      );

      const baseCommitData = baseCommitResp.data as {
        tree: { sha: string };
      };

      const baseTreeSha = baseCommitData.tree.sha;


      // 3. Crear blob con el contenido nuevo
      const blobResp = await requestWithRetry(
        "POST /repos/{owner}/{repo}/git/blobs",
        {
          owner,
          repo,
          content: Buffer.from(fileContent, "utf8").toString("base64"),
          encoding: "base64",
        }
      );

      const blobData = blobResp.data as {
        sha: string;
      };

      const blobSha = blobData.sha;


      // 4. Crear nuevo tree
      const treeResp = await requestWithRetry(
        "POST /repos/{owner}/{repo}/git/trees",
        {
          owner,
          repo,
          base_tree: baseTreeSha,
          tree: [
            {
              path: filePath,
              mode: "100644",
              type: "blob",
              sha: blobSha,
            },
          ],
        }
      );

      const treeData = treeResp.data as {
        sha: string;
      };

      const newTreeSha = treeData.sha;


      // 5. Crear el nuevo commit
      const commitResp = await requestWithRetry(
        "POST /repos/{owner}/{repo}/git/commits",
        {
          owner,
          repo,
          message: commitMessage,
          tree: newTreeSha,
          parents: [baseCommitSha],
        }
      );

      const commitData = commitResp.data as {
        sha: string;
      };

      const newCommitSha = commitData.sha;


      // 6. Actualizar la rama para que apunte al nuevo commit
      await requestWithRetry(
        "PATCH /repos/{owner}/{repo}/git/refs/heads/{branch}",
        {
          owner,
          repo,
          branch,
          sha: newCommitSha,
        }
      );

      return {
        sha: newCommitSha,
        branch,
        path: filePath,
      };
    },
  };
}