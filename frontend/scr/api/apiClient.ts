import { API_BASE_URL } from "../config.ts";
import { Ticket } from "../types/ticket.ts";
import { ApiError } from "../types/apiError.ts";

async function request(
  url: string,
  options?: RequestInit,
): Promise<unknown> {

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    const data: ApiError | unknown =
      await response.json().catch(() => null);

    if (!response.ok) {

      if (response.status === 400) {
        throw new Error(
          (data as ApiError)?.message ||
          "Validation error",
        );
      }

      if (response.status === 404) {
        throw new Error(
          (data as ApiError)?.message ||
          "Resource not found",
        );
      }

      if (response.status === 500) {
        throw new Error(
          (data as ApiError)?.message ||
          "Server error",
        );
      }

      throw new Error(
        (data as ApiError)?.message ||
        "Request failed",
      );
    }

    return data;

  } catch (error: unknown) {

    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new Error("Request timeout");
    }

    if (error instanceof TypeError) {
      throw new Error(
        "Backend unavailable. Try again later.",
      );
    }

    throw error;

  } finally {
    clearTimeout(timeout);
  }
}

export function getTickets(
  sortField: string,
  sortDirection: string,
) {
  return request(
    `${API_BASE_URL}/tickets?sort=${sortField}&order=${sortDirection}`,
  );
}

export function getTicketById(id: number) {
  return request(
    `${API_BASE_URL}/tickets/${id}`,
  );
}

export function createTicket(
  data: Omit<Ticket, "id">,
) {
  return request(
    `${API_BASE_URL}/tickets`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
}

export function updateTicket(
  id: number,
  data: Omit<Ticket, "id">,
) {
  return request(
    `${API_BASE_URL}/tickets/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
}

export function deleteTicket(id: number) {
  return request(
    `${API_BASE_URL}/tickets/${id}`,
    {
      method: "DELETE",
    },
  );
}