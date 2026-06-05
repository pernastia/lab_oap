import { type Request, type Response, type NextFunction } from "express";
import * as service from "../services/tickets.service.js";
import { ApiError } from "../errors.js";
import {
  type CreateTicketRequestDTO,
  type UpdateTicketRequestDTO,
} from "../dtos/tickets.dto.js";

export async function getAllTickets(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tickets = await service.getAllTickets(req.query);

    res.status(200).json({
      data: tickets,
      meta: {
        total: tickets.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getTicketById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);
    const currentUserId = (req as any).currentUserId as number | undefined;

    if (currentUserId !== undefined) {
      const owned = await service.getTicketByIdAndOwner(id, currentUserId);
      if (!owned) {
        throw new ApiError(
          404,
          "NOT_FOUND",
          "Ticket not found or access denied",
        );
      }
      return res.status(200).json({ data: owned });
    }

    const ticket = await service.getTicket(id);
    if (!ticket) {
      throw new ApiError(404, "NOT_FOUND", "Ticket not found");
    }

    res.status(200).json({ data: ticket });
  } catch (error) {
    next(error);
  }
}

export async function createTicket(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const dto: CreateTicketRequestDTO = req.body;
    const ticket = await service.createTicket(dto);

    res.status(201).json({
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTicket(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);
    const dto: UpdateTicketRequestDTO = req.body;
    const currentUserId = (req as any).currentUserId as number | undefined;
    if (currentUserId !== undefined) {
      const owned = await service.getTicketByIdAndOwner(id, currentUserId);
      if (!owned) {
        throw new ApiError(
          404,
          "NOT_FOUND",
          "Ticket not found or access denied",
        );
      }
    }
    const ticket = await service.updateTicket(id, dto);
    if (!ticket) {
      throw new ApiError(404, "NOT_FOUND", "Ticket not found");
    }
    res.status(200).json({ data: ticket });
  } catch (error) {
    next(error);
  }
}

export async function deleteTicket(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const deleted = await service.removeTicket(Number(req.params.id));

    if (!deleted) {
      throw new ApiError(404, "NOT_FOUND", "Ticket not found");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getTopTicketsWithTopUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await service.getTop3TicketsWithTopUser();

    res.json({
      data,
    });
  } catch (error) {
    next(error);
  }
}
