import { type Request, type Response, type NextFunction } from "express";
import * as service from "../services/ticketMessages.service.js";
import { ApiError } from "../errors.js";

export async function getAllMessages(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const messages = await service.getAllMessages();

    res.status(200).json({
      data: messages,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMessageById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const message = await service.getMessage(Number(req.params.id));

    if (!message) {
      throw new ApiError(404, "NOT_FOUND", "Message not found");
    }

    res.status(200).json({
      data: message,
    });
  } catch (error) {
    next(error);
  }
}

export async function createMessage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const message = await service.createMessage(req.body);

    res.status(201).json({
      data: message,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMessage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const deleted = await service.deleteMessage(Number(req.params.id));

    if (!deleted) {
      throw new ApiError(404, "NOT_FOUND", "Message not found");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
