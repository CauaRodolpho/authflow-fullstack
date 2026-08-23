import { Router } from "express";
import prisma from "../lib/prisma.js";
import {
  createUserSchema,
  objectIdSchema,
  updateUserSchema,
  userQuerySchema,
} from "../schemas/user.schema.js";

const usersRouter = Router();

usersRouter.post("/", async (request, response) => {
  const data = createUserSchema.parse(request.body);
  const user = await prisma.user.create({
    data,
    select: { id: true, name: true, email: true, age: true, createdAt: true },
  });

  return response.status(201).json(user);
});

usersRouter.get("/", async (request, response) => {
  const filters = userQuerySchema.parse(request.query);
  const users = await prisma.user.findMany({
    where: filters,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, age: true, createdAt: true },
  });

  return response.status(200).json(users);
});

usersRouter.get("/:id", async (request, response) => {
  const id = objectIdSchema.parse(request.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, age: true, createdAt: true },
  });

  if (!user) {
    return response.status(404).json({ error: "Usuario nao encontrado" });
  }

  return response.status(200).json(user);
});

usersRouter.put("/:id", async (request, response) => {
  const id = objectIdSchema.parse(request.params.id);
  const data = updateUserSchema.parse(request.body);
  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, age: true, createdAt: true },
  });

  return response.status(200).json(user);
});

usersRouter.delete("/:id", async (request, response) => {
  const id = objectIdSchema.parse(request.params.id);
  await prisma.user.delete({ where: { id } });

  return response.status(204).send();
});

export default usersRouter;
