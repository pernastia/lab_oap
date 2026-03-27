import { type Request, type Response, type NextFunction } from "express";
import * as repo from "../repositories/users.repository.js";

export function getUsers(req: Request, res: Response) {
  const users = repo.getAllUsers();
  res.status(200).json(users);
}

export function getUser(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);

  const user = repo.getUserById(id);

  if (!user) {
    return next({
      status: 404,
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  res.status(200).json(user);
}

export function createUser(req: Request, res: Response) {
  const { name } = req.body;

  const user = repo.createUser(name);

  res.status(201).json(user);
}

export function updateUser(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);
  const { name } = req.body;

  const user = repo.updateUser(id, name);

  if (!user) {
    return next({
      status: 404,
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  res.status(200).json(user);
}

export function deleteUser(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);

  const deleted = repo.deleteUser(id);

  if (!deleted) {
    return next({
      status: 404,
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  res.status(204).send();
}
