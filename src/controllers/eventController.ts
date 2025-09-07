import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";
import { db } from "../db";
import { eventsTable } from "../db/schema";

// Listar todos os eventos
export const getAllEvents = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const userEvents = await db.select().from(eventsTable).where(eq(eventsTable.userId, userId));
  res
    .status(200)
    .json({
      data: userEvents,
      message: "Eventos obtidos com sucesso.",
    });
};

// Obter um evento por ID
export const getEventById = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const eventId = req.params.id ? parseInt(req.params.id) : null;
  if (!eventId) {
    return res.status(400).json({ message: "ID do evento inválido." });
  }
  const event = await db.select().from(eventsTable).where(and(eq(eventsTable.id, eventId), eq(eventsTable.userId, userId))).limit(1);
  if (event.length > 0) {
    return res.status(200).json({ data: event[0], message: "Evento obtido com sucesso." });
  }
  return res.status(404).json({ message: "Evento não encontrado." });
};

// Criar um novo evento
export const createEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const {
      name,
      category,
      date,
      description,
      time,
      location,
      facebook,
      instagram,
      twitter,
      email,
      whatsApp,
    } = req.body;

    if (!name || !category || !date) {
      return res.status(400).json({ message: "Nome, categoria e data são obrigatórios." });
    }

    const [newEvent] = await db
      .insert(eventsTable)
      .values({
        name,
        category,
        date,
        description,
        time,
        location,
        facebook,
        instagram,
        twitter,
        email,
        whatsApp,
        userId,
      })
      .returning();

    res.status(201).json({
      data: newEvent,
      message: "Evento criado com sucesso.",
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar evento.", error });
  }
};

// Atualizar um evento
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const eventId = req.params.id ? parseInt(req.params.id) : null;
    if (!eventId) {
      return res.status(400).json({ message: "ID do evento inválido." });
    }

    // Verifica se o evento existe e pertence ao usuário
    const event = await db
      .select()
      .from(eventsTable)
      .where(and(eq(eventsTable.id, eventId), eq(eventsTable.userId, userId)))
      .limit(1);

    if (event.length === 0) {
      return res.status(404).json({ message: "Evento não encontrado." });
    }

    const {
      name,
      category,
      date,
      description,
      time,
      location,
      facebook,
      instagram,
      twitter,
      email,
      whatsApp,
    } = req.body;

    const [updatedEvent] = await db
      .update(eventsTable)
      .set({
        name,
        category,
        date,
        description,
        time,
        location,
        facebook,
        instagram,
        twitter,
        email,
        whatsApp,
      })
      .where(and(eq(eventsTable.id, eventId), eq(eventsTable.userId, userId)))
      .returning();

    res.status(200).json({
      data: updatedEvent,
      message: "Evento atualizado com sucesso.",
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar evento.", error });
  }
};

// Deletar um evento
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const eventId = req.params.id ? parseInt(req.params.id) : null;
    if (!eventId) {
      return res.status(400).json({ message: "ID do evento inválido." });
    }

    // Verifica se o evento existe e pertence ao usuário
    const event = await db
      .select()
      .from(eventsTable)
      .where(and(eq(eventsTable.id, eventId), eq(eventsTable.userId, userId)))
      .limit(1);

    if (event.length === 0) {
      return res.status(404).json({ message: "Evento não encontrado." });
    }

    await db
      .delete(eventsTable)
      .where(and(eq(eventsTable.id, eventId), eq(eventsTable.userId, userId)));

    res.status(200).json({
      message: "Evento deletado com sucesso.",
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar evento.", error });
  }
};
