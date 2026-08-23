import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.routes.js";
import authRouter from "./routes/auth.routes.js";
import { requireAuth } from "./middlewares/auth.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.disable("x-powered-by");
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origem nao permitida pelo CORS"));
    },
  }),
);
app.use(express.json({ limit: "10kb" }));

app.get("/health", (_request, response) => {
  return response.status(200).json({ status: "ok", service: "authflow-api" });
});

app.use("/auth", authRouter);
app.use("/usuarios", requireAuth, usersRouter);

app.use((_request, response) => {
  return response.status(404).json({ error: "Rota nao encontrada" });
});

app.use(errorHandler);

export default app;
