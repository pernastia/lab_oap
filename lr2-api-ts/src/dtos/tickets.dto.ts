export interface CreateTicketRequestDTO {
  subject: string;
  status: string;
  priority: string;
  message: string;
  author: string;
  authorId: number;
  statusId: number;
}

export interface UpdateTicketRequestDTO {
  subject: string;
  status: string;
  priority: string;
  message: string;
}

export interface TicketResponseDTO {
  id: number;
  subject: string;
  status: string;
  priority: string;
  message: string;
  author: string;
}
