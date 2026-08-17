import { describe, it, expect, vi } from "vitest";
import { makeGitHubOperations } from "../src/github/operations.js";

describe("GitHub operations con mock", () => {

  // 1 - LIST REPOSITORIES
  it("lista repositorios usando el cliente GitHub inyectado", async () => {
    const fakeGithub = {
      request: vi.fn().mockResolvedValue({
        data: [{ name: "demo" }],
      }),
    };

    const operations = makeGitHubOperations(fakeGithub);

    const result = await operations.listRepositories();

    expect(fakeGithub.request).toHaveBeenCalledWith(
      "GET /user/repos",
      {
        type: "all",
        sort: "updated",
      }
    );

    expect(result).toEqual([
      { name: "demo" },
    ]);
  });


  // 2 - CREATE REPOSITORY
  it("crea un repositorio con nombre y descripción", async () => {
    const fakeGithub = {
      request: vi.fn().mockResolvedValue({
        data: {
          name: "mi-repo",
          description: "Repositorio de prueba",
        },
      }),
    };

    const operations = makeGitHubOperations(fakeGithub);

    const result = await operations.createRepository(
      "mi-repo",
      "Repositorio de prueba"
    );

    expect(fakeGithub.request).toHaveBeenCalledWith(
      "POST /user/repos",
      {
        name: "mi-repo",
        description: "Repositorio de prueba",
      }
    );

    expect(result).toEqual({
      name: "mi-repo",
      description: "Repositorio de prueba",
    });
  });


  // 3 - CREATE ISSUE
  it("crea un issue enviando los parámetros correctos", async () => {
    const fakeGithub = {
      request: vi.fn().mockResolvedValue({
        data: {
          number: 1,
          title: "Corregir login",
        },
      }),
    };

    const operations = makeGitHubOperations(fakeGithub);

    const result = await operations.createIssue(
      "acme",
      "demo",
      "Corregir login",
      "Revisar validación"
    );

    expect(fakeGithub.request).toHaveBeenCalledWith(
      "POST /repos/{owner}/{repo}/issues",
      {
        owner: "acme",
        repo: "demo",
        title: "Corregir login",
        body: "Revisar validación",
      }
    );

    expect(result).toEqual({
      number: 1,
      title: "Corregir login",
    });
  });

});