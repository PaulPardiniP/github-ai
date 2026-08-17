import { z } from "zod";
import { listRepositoriesSchema } from "../schemas/index.js";
import type { makeGitHubOperations } from "../github/operations.js";

type GitHubOperations = ReturnType<typeof makeGitHubOperations>;

export const listRepositoriesTool = {
  name: "list_repositories",

  description:
    "Lista los repositorios de la cuenta de GitHub autenticada.",

  inputSchema: z.toJSONSchema(listRepositoriesSchema),
};

export async function handleListRepositories(
  args: unknown,
  operations: GitHubOperations
) {
  listRepositoriesSchema.parse(args);

  const repositories = await operations.listRepositories();

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(repositories, null, 2),
      },
    ],
  };
}