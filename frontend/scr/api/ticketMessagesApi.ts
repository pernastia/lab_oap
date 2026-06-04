import { API_BASE_URL } from "../config.js";
import { TicketMessage } from "../types/ticketMessages.js";

export async function getMessages(): Promise<TicketMessage[]> {

  const response = await fetch(
    `${API_BASE_URL}/ticket-messages`
  );

  const result = await response.json();

  return result.data;
}

export async function createMessage(
  data: Omit<TicketMessage, "id">
): Promise<TicketMessage> {

  const response = await fetch(
    `${API_BASE_URL}/ticket-messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );

  const result = await response.json();

  return result.data;
}

export async function deleteMessage(
  id: number
): Promise<void> {

  await fetch(
    `${API_BASE_URL}/ticket-messages/${id}`,
    {
      method: "DELETE"
    }
  );
}
