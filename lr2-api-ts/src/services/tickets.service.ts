import * as repo from "../repositories/tickets.repository.js";
import {
  type CreateTicketRequestDTO,
  type UpdateTicketRequestDTO,
} from "../dtos/tickets.dto.js";

export const getAllTickets = async (query: {
  statusId?: number;
  userId?: number;
  sort?: string;
  order?: string;
}) => {
  return await repo.getAllTickets(query);
};

export const getTicket = async (id: number) => {
  return await repo.getTicketById(id);
};

export const createTicket = async (data: CreateTicketRequestDTO) => {
  return await repo.createTicket(data);
};

export const updateTicket = async (
  id: number,
  data: UpdateTicketRequestDTO,
) => {
  return await repo.updateTicket(id, data);
};

export const removeTicket = async (id: number) => {
  return await repo.deleteTicket(id);
};

export function getTop3TicketsWithTopUser() {
  return repo.getTop3TicketsWithTopUser();
}
