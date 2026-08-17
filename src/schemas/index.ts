import { z } from "zod";

// Regla exigida por la consigna para nombres de repositorios
const repositoryNameSchema = z
  .string()
  .min(3, "El nombre del repositorio debe tener al menos 3 caracteres")
  .max(100, "El nombre del repositorio no puede superar los 100 caracteres")
  .regex(
    /^[a-zA-Z0-9-]+$/,
    "El nombre del repositorio solo puede contener letras, números y guiones"
  );


// 1. CREATE REPOSITORY
export const createRepositorySchema = z.object({
  name: repositoryNameSchema.describe("Nombre del repositorio a crear"),

  description: z
    .string()
    .max(300, "La descripción no puede superar los 300 caracteres")
    .optional()
    .describe("Descripción opcional del repositorio"),
});


// 2. CREATE ISSUE
export const createIssueSchema = z.object({
  owner: z
    .string()
    .min(1, "Debes indicar el propietario del repositorio")
    .describe("Usuario u organización propietaria del repositorio"),

  repo: repositoryNameSchema.describe("Nombre del repositorio"),

title: z
  .string()
  .min(1, "El issue debe tener un título")
  .max(120, "El título es demasiado largo")
  .describe("Título del issue"),

body: z
  .string()
  .max(5000, "El body es demasiado largo")
  .optional()
  .describe("Descripción opcional del issue"),
});


// 3. LIST REPOSITORIES
export const listRepositoriesSchema = z.object({
  type: z
    .enum(["all", "owner", "public", "private", "member"])
    .default("all")
    .describe("Tipo de repositorios que se desean listar"),

  sort: z
    .enum(["created", "updated", "pushed", "full_name"])
    .default("updated")
    .describe("Criterio usado para ordenar los repositorios"),
});


// 4. LIST ISSUES
export const listIssuesSchema = z.object({
  owner: z
    .string()
    .min(1, "Debes indicar el propietario del repositorio")
    .describe("Usuario u organización propietaria del repositorio"),

  repo: repositoryNameSchema.describe("Nombre del repositorio"),
});


// 5. CREATE COMMIT
export const createCommitSchema = z.object({
  owner: z
    .string()
    .min(1, "Debes indicar el propietario del repositorio")
    .describe("Usuario u organización propietaria del repositorio"),

  repo: repositoryNameSchema.describe("Nombre del repositorio"),

  branch: z
    .string()
    .min(1, "Debes indicar una rama")
    .default("main")
    .describe("Rama donde se realizará el commit"),

  filePath: z
    .string()
    .min(1, "Debes indicar la ruta del archivo")
    .describe("Ruta del archivo, por ejemplo README.md o src/index.ts"),

  fileContent: z
    .string()
    .describe("Contenido que tendrá el archivo"),

  commitMessage: z
    .string()
    .min(1, "Debes indicar un mensaje para el commit")
    .describe("Mensaje que describe el cambio realizado"),
});


// Tipos TypeScript derivados automáticamente de los schemas
export type CreateRepositoryInput = z.infer<typeof createRepositorySchema>;
export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type ListRepositoriesInput = z.infer<typeof listRepositoriesSchema>;
export type ListIssuesInput = z.infer<typeof listIssuesSchema>;
export type CreateCommitInput = z.infer<typeof createCommitSchema>;