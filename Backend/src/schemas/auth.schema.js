import { z } from "zod";

const email = z.string().trim().email("Informe um email valido").max(120).transform(value => value.toLowerCase());
const password = z.string({ required_error: "A senha e obrigatoria" }).min(8, "A senha deve ter pelo menos 8 caracteres").max(72, "A senha deve ter no maximo 72 caracteres");

export const registerSchema = z.object({
  name: z.string().trim().min(2, "O nome deve ter pelo menos 2 caracteres").max(80),
  email,
  password,
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "A senha e obrigatoria"),
});
