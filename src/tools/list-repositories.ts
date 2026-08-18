import { z } from "zod";
import { listRepositoriesSchema } from "../schemas/index.js";
import type { makeGitHubOperations } from "../github/operations.js";

type GitHubOperations = ReturnType<typeof makeGitHubOperations>;

export const listRepositoriesTool = {
  name: "list_repositories",

  description:
    "Lista los repositorios de la cuenta de GitHub autenticada, permitiendo filtrar por tipo y ordenar los resultados.",

  inputSchema: z.toJSONSchema(listRepositoriesSchema),
};

export async function handleListRepositories(
  args: unknown,
  operations: GitHubOperations
) {
  // 1. Valida y obtiene los filtros elegidos
  const input = listRepositoriesSchema.parse(args);

  // 2. Llama a GitHub usando esos filtros
  const repositories = await operations.listRepositories(
    input.type,
    input.sort
  ) as Array<{
    name: string;
    private: boolean;
    html_url: string;
    description: string | null;
  }>;

  // 3. Dejamos solamente información útil para el LLM
  const result = repositories.map((repo) => ({
    name: repo.name,
    private: repo.private,
    url: repo.html_url,
    description: repo.description,
  }));

  // 4. Devolvemos la respuesta simplificada
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}