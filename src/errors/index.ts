import { ZodError } from "zod";


// Tipos de errores propios de nuestra aplicación
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class GitHubAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GitHubAPIError";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}


// Convierte errores técnicos en errores entendibles
export function toToolError(
  err: unknown,
  context?: { repo?: string }
) {

  // Error de validación de Zod
if (err instanceof ZodError) {
  return {
    ok: false,
    error: {
      type: "invalid_input",
      message:
        err.issues[0]?.message ??
        "Los datos enviados no cumplen con los requisitos.",
      details: err.issues,
    },
  };
}


  // Obtenemos status si viene de GitHub
  const status = (err as { status?: number }).status;


  // Token inválido
  if (status === 401) {
    return {
      ok: false,
      error: {
        type: "authentication_error",
        message:
          "No fue posible autenticarse con GitHub. Verifica el token configurado.",
      },
    };
  }


  // Sin permisos
  if (status === 403) {
    return {
      ok: false,
      error: {
        type: "github_api_error",
        message:
          "GitHub rechazó la operación. Verifica los permisos del token o el rate limit.",
      },
    };
  }


  // Repositorio/recurso inexistente
  if (status === 404) {
    return {
      ok: false,
      error: {
        type: "github_api_error",
        message: context?.repo
          ? `El repositorio "${context.repo}" no fue encontrado. Verifica el nombre e intenta de nuevo.`
          : "El recurso solicitado no fue encontrado en GitHub.",
      },
    };
  }


  // Rate limit
  if (status === 429) {
    return {
      ok: false,
      error: {
        type: "rate_limit_error",
        message:
          "Se alcanzó temporalmente el límite de solicitudes de GitHub. Intenta nuevamente más tarde.",
      },
    };
  }


  // Error de red
  if (
    err instanceof Error &&
    ["ECONNRESET", "ENOTFOUND", "ETIMEDOUT"].some((code) =>
      err.message.includes(code)
    )
  ) {
    return {
      ok: false,
      error: {
        type: "network_error",
        message:
          "No fue posible comunicarse con GitHub. Verifica la conexión e intenta nuevamente.",
      },
    };
  }


  // Cualquier otro error
  return {
    ok: false,
    error: {
      type: "unknown_error",
      message:
        "Ocurrió un error inesperado al realizar la operación.",
    },
  };
}