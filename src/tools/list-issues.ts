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
) as Array<{
  number: number;
  title: string;
  state: string;
  html_url: string;
  body: string | null;
}>;

const result = issues.map((issue) => ({
  number: issue.number,
  title: issue.title,
  url: issue.html_url,
  description: issue.body,
}));

return {
  content: [
    {
      type: "text" as const,
      text: JSON.stringify(result, null, 2),
    },
  ],
}; 
}