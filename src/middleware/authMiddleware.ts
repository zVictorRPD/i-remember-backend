import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Estendendo a interface Request do Express para incluir nossa propriedade 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      // Extrai o token do cabeçalho "Bearer TOKEN"
      token = authHeader.split(" ")[1];

      // Verifica o token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Anexa os dados do usuário decodificado à requisição
      req.user = decoded;

      next(); // Passa para a próxima função (o controller)
    } catch (error) {
      res.status(401).json({ message: "Token inválido ou expirado." });
    }
  } else {
    res.status(401).json({ message: "Não autorizado, token não fornecido." });
  }
};
