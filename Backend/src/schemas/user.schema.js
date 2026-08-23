import { z } from "zod";

const nameSchema = z
  .string({ required_error: "O nome e obrigatorio" })
  .trim()
  .min(2, "O nome deve ter pelo menos 2 caracteres")
  .max(80, "O nome deve ter no maximo 80 caracteres");

const emailSchema = z
  .string({ required_error: "O email e obrigatorio" })
  .trim()
  .email("Informe um email valido")
  .max(120, "O email deve ter no maximo 120 caracteres")
  .transform((email) => email.toLowerCase());

const ageSchema = z.coerce
  .number({ invalid_type_error: "A idade deve ser um numero" })
  .int("A idade deve ser um numero inteiro")
  .min(1, "A idade deve ser maior que zero")
  .max(120, "Informe uma idade valida");

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  age: ageSchema,
});

export const updateUserSchema = z
  .object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    age: ageSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe pelo menos um campo para atualizar",
  });

export const userQuerySchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.string().trim().email().transform((email) => email.toLowerCase()).optional(),
  age: ageSchema.optional(),
});

export const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "ID de usuario invalido");
