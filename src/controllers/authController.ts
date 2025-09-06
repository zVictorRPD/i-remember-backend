import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { db } from "../db";
import { usersTable } from "../db/schema";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("A variável de ambiente JWT_SECRET não está definida!");
}

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }

  const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existingUser) {
    return res.status(409).json({ message: "Este email já está em uso." });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = await db.insert(usersTable).values({ name, email, password: passwordHash }).returning({
    id: usersTable.id,
    name: usersTable.name,
    email: usersTable.email,
  });

  res.status(201).json({ data: newUser, message: "Usuário registrado com sucesso." });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (result.length === 0) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const user = result[0];

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const tokenPayload = { userId: user.id, email: user.email };
  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7D' });

  res.status(200).json({ token });
};
export const changePassword = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId; 
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Senha antiga e nova são obrigatórias.' });
  }

  const result = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (result.length === 0) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  const user = result[0];

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Senha antiga incorreta.' });
  }

  const salt = await bcrypt.genSalt(10);
  const newPasswordHash = await bcrypt.hash(newPassword, salt);

  await db.update(usersTable)
    .set({ password: newPasswordHash })
    .where(eq(usersTable.id, userId));

  res.status(200).json({ message: 'Senha alterada com sucesso.' });
};