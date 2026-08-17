import { z } from "zod";
import { createRepositorySchema } from "../schemas/index.js";
import type { makeGitHubOperations } from "../github/operations.js";

type GitHubOperations = ReturnType<typeof makeGitHubOperations>;

export const createRepositoryTool = {
  name: "create_repository",

  description:
    "Crea un nuevo repositorio en la cuenta de GitHub autenticada.",

  inputSchema: z.toJSONSchema(createRepositorySchema),
};

export async function handleCreateRepository(
  args: unknown,
  operations: GitHubOperations
) {
  const input = createRepositorySchema.parse(args);

  await operations.createRepository(
    input.name,
    input.description
  );

  return {
    content: [
      {
        type: "text" as const,
        text: `Repositorio "${input.name}" creado correctamente.`,
      },
    ],
  };
}