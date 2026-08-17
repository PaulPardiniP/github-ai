import { describe, it, expect } from "vitest";
import { z } from "zod";
import { toToolError } from "../src/errors/index.js";

describe("Transformación de errores", () => {

  // 1 - ZOD
  it("transforma un ZodError en invalid_input", () => {
    const schema = z.object({
      name: z.string(),
    });

    const parsed = schema.safeParse({
      name: 123,
    });

    if (parsed.success) {
      throw new Error("El test esperaba un error de Zod");
    }

    const result = toToolError(parsed.error);

    expect(result.error.type).toBe("invalid_input");
  });


  // 2 - 401
  it("transforma un error 401 en authentication_error", () => {
    const error = {
      status: 401,
    };

    const result = toToolError(error);

    expect(result.error.type).toBe("authentication_error");
  });


  // 3 - 404
  it("transforma un 404 en un mensaje de repositorio no encontrado", () => {
    const error = {
      status: 404,
    };

    const result = toToolError(error, {
      repo: "demo",
    });

    expect(result.error.type).toBe("github_api_error");
    expect(result.error.message).toContain("demo");
  });


  // 4 - RATE LIMIT
  it("transforma un 429 en rate_limit_error", () => {
    const error = {
      status: 429,
    };

    const result = toToolError(error);

    expect(result.error.type).toBe("rate_limit_error");
  });

});