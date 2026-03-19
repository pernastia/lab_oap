import { type Request, type Response, type NextFunction } from "express";
import * as service from "../services/statuses.service.js";
import { validateCreateStatus } from "../validators/statuses.validator.js";
import { ApiError } from "../errors.js";

export const getAll = (req: Request, res: Response) => {
  res.json({ items: service.getAllStatuses() });
};

export const getById = (req: Request, res: Response, next: NextFunction) => {
  const item = service.getStatusById(Number(req.params.id));
  if (!item) return next(new ApiError(404, "NOT_FOUND", "Status not found"));
  res.json(item);
};

export const create = (req: Request, res: Response, next: NextFunction) => {
  const errors = validateCreateStatus(req.body);

  if (errors.length > 0) {
    return next({
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Invalid request",
      details: errors,
    });
  }

  const item = service.createStatus(req.body);
  res.status(201).json(item);
};

export const update = (req: Request, res: Response, next: NextFunction) => {
  const item = service.updateStatus(Number(req.params.id), req.body);
  if (!item) return next(new ApiError(404, "NOT_FOUND", "Status not found"));
  res.json(item);
};

export const remove = (req: Request, res: Response, next: NextFunction) => {
  const ok = service.deleteStatus(Number(req.params.id));
  if (!ok) return next(new ApiError(404, "NOT_FOUND", "Status not found"));
  res.status(204).send();
};
