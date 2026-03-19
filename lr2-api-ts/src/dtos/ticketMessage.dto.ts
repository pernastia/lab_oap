export interface CreateMessageDto {
  ticketId: number;
  text: string;
}

export interface MessageResponseDto {
  id: number;
  ticketId: number;
  text: string;
}
