import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { IUser } from "../interfaces/user";

const users: IUser[] = [];

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("A variável de ambiente JWT_SECRET não está definida!");
}

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }

  // Verifica se o usuário já existe
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: "Este email já está em uso." });
  }

  // Cria o hash da senha
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  res.status(201).json({ message: "Usuário registrado com sucesso." });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  // Encontra o usuário
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas.' }); // Mensagem genérica por segurança
  }

  // Compara a senha enviada com o hash armazenado
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  // Gera o token JWT
  const tokenPayload = { userId: user.id, email: user.email };
  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' }); // Token expira em 1 hora

  res.status(200).json({ token });
};

export const changePassword = async (req: Request, res: Response) => {
  // O ID do usuário virá do token decodificado, não do corpo da requisição
  const userId = (req as any).user.userId; 
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Senha antiga e nova são obrigatórias.' });
  }

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado.' }); // Isso não deveria acontecer se o token for válido
  }

  // Verifica a senha antiga
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Senha antiga incorreta.' });
  }

  // Gera o hash da nova senha
  const salt = await bcrypt.genSalt(10);
  const newPasswordHash = await bcrypt.hash(newPassword, salt);

  // Atualiza a senha do usuário
  user.password = newPasswordHash;

  res.status(200).json({ message: 'Senha alterada com sucesso.' });
};