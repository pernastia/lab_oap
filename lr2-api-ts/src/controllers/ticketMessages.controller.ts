import { type Request, type Response, type NextFunction } from "express";
import * as service from "../services/ticketMessages.service.js";
import { validateCreateMessage } from "../validators/ticketMessages.validator.js";
import { ApiError } from "../errors.js";

export const getAll = (req: Request, res: Response) => {
  res.json({ items: service.getAllMessages() });
};

export const getById = (req: Request, res: Response, next: NextFunction) => {
  const m = service.getMessage(Number(req.params.id));
  if (!m) return next(new ApiError(404, "NOT_FOUND", "Message not found"));
  res.json(m);
};

export const create = (req: Request, res: Response, next: NextFunction) => {
  const errors = validateCreateMessage(req.body);

  if (errors.length > 0) {
    return next({
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Invalid request",
      details: errors,
    });
  }

  const m = service.createMessage(req.body);
  res.status(201).json(m);
};

export const remove = (req: Request, res: Response, next: NextFunction) => {
  const ok = service.deleteMessage(Number(req.params.id));
  if (!ok) return next(new ApiError(404, "NOT_FOUND", "Message not found"));
  res.status(204).send();
};
