import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";

const authRouter = Router();

authRouter.use((_request, response, next) => {
  response.set("Cache-Control", "no-store");
  next();
});

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    const error = new Error("JWT_SECRET deve ter pelo menos 32 caracteres");
    error.statusCode = 500;
    throw error;
  }
  return secret;
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, age: user.age };
}

function createToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, getJwtSecret(), {
    expiresIn: "2h",
  });
}

authRouter.post("/register", async (request, response) => {
  const data = registerSchema.parse(request.body);
  const existingUser = await prisma.account.findUnique({ where: { email: data.email } });

  if (existingUser) {
    return response.status(409).json({ error: "Este email ja esta cadastrado" });
  }

  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.account.create({
    data: { name: data.name, email: data.email, passwordHash },
  });

  return response.status(201).json({ user: publicUser(user), token: createToken(user) });
});

authRouter.post("/login", async (request, response) => {
  const data = loginSchema.parse(request.body);
  const user = await prisma.account.findUnique({ where: { email: data.email } });
  const validPassword = user
    ? await bcrypt.compare(data.password, user.passwordHash)
    : false;

  if (!user || !validPassword) {
    return response.status(401).json({ error: "Email ou senha incorretos" });
  }

  return response.json({ user: publicUser(user), token: createToken(user) });
});

authRouter.post("/demo", (_request, response) => {
  const demoUser = { id: "demo-access", name: "Visitante Demo", email: "demo@authflow.dev", age: null };
  return response.json({ user: demoUser, token: createToken(demoUser) });
});

export default authRouter;
