import { z } from "zod";
import { listIssuesSchema } from "../schemas/index.js";
import type { makeGitHubOperations } from "../github/operations.js";

type GitHubOperations = ReturnType<typeof makeGitHubOperations>;

export const listIssuesTool = {
  name: "list_issues",

  description:
    "Lista los issues abiertos de un repositorio específico.",

  inputSchema: z.toJSONSchema(listIssuesSchema),
};

export async function handleListIssues(
  args: unknown,
  operations: GitHubOperations
) {
  const input = listIssuesSchema.parse(args);

  const issues = await operations.listIssues(
    input.owner,
    input.repo
  );

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(issues, null, 2),
      },
    ],
  };
}