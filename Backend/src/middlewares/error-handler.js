import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export function errorHandler(error, _request, response, _next) {
  if (error instanceof ZodError) {
    return response.status(400).json({
      error: "Dados invalidos",
      details: error.errors.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return response.status(409).json({ error: "Este email ja esta cadastrado" });
    }

    if (error.code === "P2025") {
      return response.status(404).json({ error: "Usuario nao encontrado" });
    }
  }

  if (error.message === "Origem nao permitida pelo CORS") {
    return response.status(403).json({ error: error.message });
  }

  if (error.statusCode) {
    return response.status(error.statusCode).json({ error: error.message });
  }

  console.error(error);
  return response.status(500).json({ error: "Erro interno do servidor" });
}
