import { eq, like } from "drizzle-orm";
import { db } from "../db";
import { eventsTable, usersTable } from "../db/schema";
import { IEvent } from "../interfaces/event";
import { sendEmail } from "./sendEmailService";

export const checkAndSendEmails = async () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');

  try {
    const results = await db
      .select()
      .from(eventsTable)
      .where(like(eventsTable.date, `%-${month}-${day}`))
      .leftJoin(usersTable, eq(eventsTable.userId, usersTable.id));

    if (results.length === 0) {
      console.log("Nenhum evento encontrado para hoje.");
      return { message: "Nenhum evento para hoje." };
    }

    console.log(`Encontrados ${results.length} eventos para hoje.`);

    for (const result of results) {
      const user = result.users;
      const event = result.events as IEvent;

      if (!user?.email) {
        console.warn(`Evento ${event.id} não possui um usuário ou email associado.`);
        continue;
      }
      try {
        await sendEmail({
          event: event,
          subject: `Lembrete: O evento "${event.name}" é hoje!`,
          to: user.email,
        });
      } catch (error) {
        console.error(`Erro ao enviar email para ${user.email}:`, error);
      }
    }

    return { message: "Emails enviados com sucesso." };
  } catch (error) {
    console.error("Erro ao buscar eventos no banco de dados:", error);
    return { message: "Erro ao processar eventos." };
  }
};
