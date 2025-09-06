import { Request, Response } from "express";

// Listar todos os eventos
export const getAllEvents = (req: Request, res: Response) => {
  res
    .status(200)
    .json({
      message: "Funcionalidade de listagem de eventos ainda não implementada.",
    });
};

// Obter um evento por ID
export const getEventById = (req: Request, res: Response) => {
  res
    .status(200)
    .json({
      message:
        "Funcionalidade de obtenção de evento por ID ainda não implementada.",
    });
};

// Criar um novo evento
export const createEvent = (req: Request, res: Response) => {
  res
    .status(201)
    .json({
      message: "Funcionalidade de criação de evento ainda não implementada.",
    });
};

// Atualizar um evento
export const updateEvent = (req: Request, res: Response) => {
  res
    .status(200)
    .json({
      message:
        "Funcionalidade de atualização de evento ainda não implementada.",
    });
};

// Deletar um evento
export const deleteEvent = (req: Request, res: Response) => {
  res
    .status(200)
    .json({
      message: "Funcionalidade de deleção de evento ainda não implementada.",
    });
};
