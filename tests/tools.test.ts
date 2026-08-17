import { describe, it, expect } from "vitest";

import {
  createRepositorySchema,
  createIssueSchema,
  listRepositoriesSchema,
  listIssuesSchema,
  createCommitSchema,
} from "../src/schemas/index.js";

describe("Schemas de las tools", () => {

  // 1 - CREATE REPOSITORY válido
  it("acepta un repositorio válido", () => {
    const result = createRepositorySchema.safeParse({
      name: "mi-repo",
      description: "Repositorio de prueba",
    });

    expect(result.success).toBe(true);
  });

  // 2 - CREATE REPOSITORY inválido
  it("rechaza un nombre de repositorio menor a 3 caracteres", () => {
    const result = createRepositorySchema.safeParse({
      name: "ab",
    });

    expect(result.success).toBe(false);
  });

  // 3 - CREATE ISSUE válido
  it("acepta un issue válido", () => {
    const result = createIssueSchema.safeParse({
      owner: "paul",
      repo: "mi-repo",
      title: "Corregir login",
      body: "Revisar validación",
    });

    expect(result.success).toBe(true);
  });

  // 4 - CREATE ISSUE inválido
  it("rechaza un issue con título vacío", () => {
    const result = createIssueSchema.safeParse({
      owner: "paul",
      repo: "mi-repo",
      title: "",
    });

    expect(result.success).toBe(false);
  });

  // 5 - LIST REPOSITORIES defaults
  it("completa los defaults al listar repositorios", () => {
    const result = listRepositoriesSchema.parse({});

    expect(result.type).toBe("all");
    expect(result.sort).toBe("updated");
  });

  // 6 - LIST ISSUES válido
  it("acepta datos válidos para listar issues", () => {
    const result = listIssuesSchema.safeParse({
      owner: "paul",
      repo: "mi-repo",
    });

    expect(result.success).toBe(true);
  });

  // 7 - LIST ISSUES inválido
  it("rechaza listar issues sin owner", () => {
    const result = listIssuesSchema.safeParse({
      owner: "",
      repo: "mi-repo",
    });

    expect(result.success).toBe(false);
  });

  // 8 - CREATE COMMIT válido
  it("acepta datos válidos para crear un commit", () => {
    const result = createCommitSchema.safeParse({
      owner: "paul",
      repo: "mi-repo",
      branch: "main",
      filePath: "README.md",
      fileContent: "# Hola",
      commitMessage: "Actualizar README",
    });

    expect(result.success).toBe(true);
  });

  // 9 - CREATE COMMIT inválido
  it("rechaza un commit sin mensaje", () => {
    const result = createCommitSchema.safeParse({
      owner: "paul",
      repo: "mi-repo",
      branch: "main",
      filePath: "README.md",
      fileContent: "# Hola",
      commitMessage: "",
    });

    expect(result.success).toBe(false);
  });

});