import { z } from "zod";
import { createIssueSchema } from "../schemas/index.js";
import type { makeGitHubOperations } from "../github/operations.js";

type GitHubOperations = ReturnType<typeof makeGitHubOperations>;

export const createIssueTool = {
  name: "create_issue",

  description:
    "Crea un nuevo issue en un repositorio específico de GitHub.",

  inputSchema: z.toJSONSchema(createIssueSchema),
};

export async function handleCreateIssue(
  args: unknown,
  operations: GitHubOperations
) {
  const input = createIssueSchema.parse(args);

  await operations.createIssue(
    input.owner,
    input.repo,
    input.title,
    input.body
  );

  return {
    content: [
      {
        type: "text" as const,
        text: `Issue "${input.title}" creado correctamente.`,
      },
    ],
  };
}