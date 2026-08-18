import { z } from "zod";


// ======================================================
// VALIDACIONES REUTILIZABLES
// ======================================================

// Nombre del repositorio:
// 3 a 100 caracteres, sin espacios, solo letras, números y guiones.
const repositoryNameSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "Debes indicar el nombre del repositorio."
        : "El nombre del repositorio debe ser un texto.",
  })
  .min(
    3,
    "El nombre del repositorio debe tener al menos 3 caracteres."
  )
  .max(
    100,
    "El nombre del repositorio no puede superar los 100 caracteres."
  )
  .regex(
    /^[a-zA-Z0-9-]+$/,
    "El nombre del repositorio no puede contener espacios. Usa solo letras, números y guiones."
  );


// Propietario del repositorio
const ownerSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "Debes indicar el propietario del repositorio."
        : "El propietario del repositorio debe ser un texto.",
  })
  .min(
    1,
    "Debes indicar el propietario del repositorio."
  );


// ======================================================
// 1. CREATE REPOSITORY
// ======================================================

export const createRepositorySchema = z.object({
  name: repositoryNameSchema.describe(
    "Nombre del repositorio a crear. Debe tener entre 3 y 100 caracteres, sin espacios, usando solo letras, números y guiones."
  ),

  description: z
    .string({
      error: "La descripción del repositorio debe ser un texto.",
    })
    .max(
      300,
      "La descripción del repositorio no puede superar los 300 caracteres."
    )
    .optional()
    .describe(
      "Descripción opcional del repositorio. Puede contener espacios y texto libre, con un máximo de 300 caracteres."
    ),
});


// ======================================================
// 2. CREATE ISSUE
// ======================================================

export const createIssueSchema = z.object({
  owner: ownerSchema.describe(
    "Usuario u organización propietaria del repositorio."
  ),

  repo: repositoryNameSchema.describe(
    "Nombre del repositorio. Debe tener entre 3 y 100 caracteres, sin espacios, usando solo letras, números y guiones."
  ),

  title: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Debes indicar el título del issue."
          : "El título del issue debe ser un texto.",
    })
    .min(
      1,
      "Debes indicar el título del issue."
    )
    .max(
      120,
      "El título del issue no puede superar los 120 caracteres."
    )
    .describe(
      "Título del issue. Puede contener espacios y debe tener un máximo de 120 caracteres."
    ),

  body: z
    .string({
      error: "La descripción del issue debe ser un texto.",
    })
    .max(
      5000,
      "La descripción del issue no puede superar los 5000 caracteres."
    )
    .optional()
    .describe(
      "Descripción opcional del issue. Puede contener espacios y texto libre, con un máximo de 5000 caracteres."
    ),
});


// ======================================================
// 3. LIST REPOSITORIES
// ======================================================

export const listRepositoriesSchema = z.object({
  type: z
    .enum(
      ["all", "owner", "public", "private", "member"],
      {
        error:
          'El tipo de repositorio debe ser "all", "owner", "public", "private" o "member".',
      }
    )
    .default("all")
    .describe(
      'Tipo de repositorios que se desean listar: "all", "owner", "public", "private" o "member".'
    ),

  sort: z
    .enum(
      ["created", "updated", "pushed", "full_name"],
      {
        error:
          'El criterio de orden debe ser "created", "updated", "pushed" o "full_name".',
      }
    )
    .default("updated")
    .describe(
      'Criterio usado para ordenar los repositorios: "created", "updated", "pushed" o "full_name".'
    ),
});


// ======================================================
// 4. LIST ISSUES
// ======================================================

export const listIssuesSchema = z.object({
  owner: ownerSchema.describe(
    "Usuario u organización propietaria del repositorio."
  ),

  repo: repositoryNameSchema.describe(
    "Nombre del repositorio. Debe tener entre 3 y 100 caracteres, sin espacios, usando solo letras, números y guiones."
  ),
});


// ======================================================
// 5. CREATE COMMIT
// ======================================================

export const createCommitSchema = z.object({
  owner: ownerSchema.describe(
    "Usuario u organización propietaria del repositorio."
  ),

  repo: repositoryNameSchema.describe(
    "Nombre del repositorio. Debe tener entre 3 y 100 caracteres, sin espacios, usando solo letras, números y guiones."
  ),

  branch: z
    .string({
      error: "La rama debe ser un texto.",
    })
    .min(
      1,
      "Debes indicar una rama."
    )
    .default("main")
    .describe(
      'Rama donde se realizará el commit. Si no se indica, se utiliza "main".'
    ),

  filePath: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Debes indicar la ruta del archivo."
          : "La ruta del archivo debe ser un texto.",
    })
    .min(
      1,
      "Debes indicar la ruta del archivo."
    )
    .describe(
      "Ruta del archivo dentro del repositorio, por ejemplo README.md o src/index.ts."
    ),

  fileContent: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Debes indicar el contenido del archivo."
          : "El contenido del archivo debe ser un texto.",
    })
    .describe(
      "Contenido que tendrá el archivo. Puede contener espacios, saltos de línea y texto libre."
    ),

  commitMessage: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Debes indicar un mensaje para el commit."
          : "El mensaje del commit debe ser un texto.",
    })
    .min(
      1,
      "Debes indicar un mensaje para el commit."
    )
    .describe(
      "Mensaje que describe el cambio realizado. Puede contener espacios."
    ),
});


// ======================================================
// TIPOS TYPESCRIPT
// ======================================================

export type CreateRepositoryInput = z.infer<
  typeof createRepositorySchema
>;

export type CreateIssueInput = z.infer<
  typeof createIssueSchema
>;

export type ListRepositoriesInput = z.infer<
  typeof listRepositoriesSchema
>;

export type ListIssuesInput = z.infer<
  typeof listIssuesSchema
>;

export type CreateCommitInput = z.infer<
  typeof createCommitSchema
>;