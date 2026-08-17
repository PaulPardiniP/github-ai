import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { githubClient } from "../github/client.js";
import { makeGitHubOperations } from "../github/operations.js";

import {
  createRepositoryTool,
  handleCreateRepository,
} from "../tools/create-repository.js";

import {
  createIssueTool,
  handleCreateIssue,
} from "../tools/create-issue.js";

import {
  listRepositoriesTool,
  handleListRepositories,
} from "../tools/list-repositories.js";

import {
  listIssuesTool,
  handleListIssues,
} from "../tools/list-issues.js";

import {
  createCommitTool,
  handleCreateCommit,
} from "../tools/create-commit.js";

import { toToolError } from "../errors/index.js";
import { logger } from "./logging.js";


// Creamos las operaciones GitHub usando el cliente real
const operations = makeGitHubOperations(githubClient);


// Creamos el servidor MCP
const server = new Server(
  {
    name: "github-ai-agent",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);


// 1. El Host pregunta qué tools existen
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      createRepositoryTool,
      createIssueTool,
      listRepositoriesTool,
      createCommitTool,
      listIssuesTool,
    ],
  };
});


// 2. El Host pide ejecutar una tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {

  const { name, arguments: args } = request.params;

  try {

    switch (name) {

      case "create_repository":
        return await handleCreateRepository(args, operations);

      case "create_issue":
        return await handleCreateIssue(args, operations);

      case "list_repositories":
        return await handleListRepositories(args, operations);

      case "list_issues":
        return await handleListIssues(args, operations);

      case "create_commit":
        return await handleCreateCommit(args, operations);

      default:
        return {
          content: [
            {
              type: "text",
              text: `Tool no encontrada: ${name}`,
            },
          ],
          isError: true,
        };
    }

  } catch (error) {

    const result = toToolError(error);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result),
        },
      ],
      isError: true,
    };
  }
});


// 3. Arrancamos el servidor por stdio
async function main() {

  const transport = new StdioServerTransport();

  await server.connect(transport);

  logger.info("MCP Server github-ai-agent iniciado");
}


main().catch((error) => {

  logger.error(
    error instanceof Error
      ? error.message
      : "Error fatal desconocido"
  );

  process.exit(1);
});
