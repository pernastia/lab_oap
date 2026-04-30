import { type Request, type Response, type NextFunction } from "express";
import * as service from "../services/statuses.service.js";
import { ApiError } from "../errors.js";

export async function getAllStatuses(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const statuses = await service.getAllStatuses();

    res.status(200).json({
      data: statuses,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStatusById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const status = await service.getStatusById(Number(req.params.id));

    if (!status) {
      throw new ApiError(404, "NOT_FOUND", "Status not found");
    }

    res.status(200).json({
      data: status,
    });
  } catch (error) {
    next(error);
  }
}

export async function createStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const status = await service.createStatus(req.body);

    res.status(201).json({
      data: status,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const status = await service.updateStatus(Number(req.params.id), req.body);

    if (!status) {
      throw new ApiError(404, "NOT_FOUND", "Status not found");
    }

    res.status(200).json({
      data: status,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const deleted = await service.deleteStatus(Number(req.params.id));

    if (!deleted) {
      throw new ApiError(404, "NOT_FOUND", "Status not found");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
