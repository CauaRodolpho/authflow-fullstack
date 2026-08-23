import jwt from "jsonwebtoken";

export function requireAuth(request, response, next) {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) return response.status(401).json({ error: "Acesso nao autorizado" });
  try {
    request.account = jwt.verify(token, secret);
    return next();
  } catch {
    return response.status(401).json({ error: "Sessao invalida ou expirada" });
  }
}
