import { Request, Response } from "express";
import { checkAndSendEmails } from "../services/emailService";

export const sendEmails = async (req: Request, res: Response) => {
  const result = await checkAndSendEmails();
  if (result.message.includes("Erro")) {
    return res.status(500).json(result);
  }
  return res.status(200).json(result);
};
