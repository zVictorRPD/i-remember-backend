import { eq, like } from "drizzle-orm";
import { Request, Response } from "express";
import { db } from "../db";
import { eventsTable, usersTable } from "../db/schema";
import { IEvent } from "../interfaces/event";
import { sendEmail } from "../services/sendEmail";

export const sendEmails = async (req: Request, res: Response) => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const results = await db
  .select()
  .from(eventsTable)
  .where(like(eventsTable.date, `%-${month}-${day}`))
  .leftJoin(usersTable, eq(eventsTable.userId, usersTable.id));
  if(results.length === 0) return res.status(200).json({ message: "Nenhum evento para hoje."});
  
  results.forEach(async (result) => {
    const usersTable = result.users;
    const eventsTable = result.events as IEvent;
    if(!usersTable?.email) return;
    console.log(`Enviando email para ${usersTable.email} sobre o evento ${eventsTable.name} que ocorre hoje.`);
    try {
      await sendEmail({
        event: eventsTable,
        subject: `Lembrete: O evento "${eventsTable.name}" é hoje!`,
        to: usersTable.email,
      });
    } catch (error) {
      console.error(`Erro ao enviar email para ${usersTable.email}:`, error);
    }
  });
  
  res.status(200).json({ message: "Emails enviados com sucesso."});
};
