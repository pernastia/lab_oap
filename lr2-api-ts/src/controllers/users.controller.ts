import { type Request, type Response, type NextFunction } from "express";
import * as service from "../services/users.service.js";
import { ApiError } from "../errors.js";

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const users = await service.getAllUsers();

    res.status(200).json({
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);

    const user = await service.getUserById(id);

    if (!user) {
      throw new ApiError(404, "NOT_FOUND", "User not found");
    }

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await service.createUser(req.body);

    res.status(201).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);

    const user = await service.updateUser(id, req.body);

    if (!user) {
      throw new ApiError(404, "NOT_FOUND", "User not found");
    }

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);

    const deleted = await service.deleteUser(id);

    if (!deleted) {
      throw new ApiError(404, "NOT_FOUND", "User not found");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
