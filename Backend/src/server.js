import "dotenv/config";
import app from "./app.js";
import prisma from "./lib/prisma.js";

const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, () => {
  console.log(`Servidor AuthFlow rodando em http://localhost:${port}`);
});

async function shutdown(signal) {
  console.log(`\n${signal} recebido. Encerrando servidor...`);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
