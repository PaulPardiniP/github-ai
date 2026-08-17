import { z } from "zod";
import { createCommitSchema } from "../schemas/index.js";
import type { makeGitHubOperations } from "../github/operations.js";

type GitHubOperations = ReturnType<typeof makeGitHubOperations>;

export const createCommitTool = {
  name: "create_commit",

  description:
    "Crea un commit agregando o modificando un archivo en una rama de un repositorio.",

  inputSchema: z.toJSONSchema(createCommitSchema),
};

export async function handleCreateCommit(
  args: unknown,
  operations: GitHubOperations
) {
  const input = createCommitSchema.parse(args);

  const result = await operations.createCommit(
    input.owner,
    input.repo,
    input.branch,
    input.filePath,
    input.fileContent,
    input.commitMessage
  );

  return {
    content: [
      {
        type: "text" as const,
        text: `Commit creado correctamente. SHA: ${result.sha}`,
      },
    ],
  };
}