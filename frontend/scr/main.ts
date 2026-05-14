import {
  getTickets,
  createTicket,
  deleteTicket,
} from "../scr/api/apiClient.js";

import {
  renderLoading,
  renderSuccess,
  renderError,
  renderEmpty,
  renderTickets,
  clearTickets,
} from "./ui.js";

import { Ticket } from "./types/ticket.js";

const form = document.getElementById(
  "ticket-form",
) as HTMLFormElement;

const subjectInput = document.getElementById(
  "subject",
) as HTMLInputElement;

const messageInput = document.getElementById(
  "message",
) as HTMLInputElement;

async function loadTickets() {
  try {
    renderLoading();

    const response = await getTickets("id", "asc") as { data: Ticket[] };
    const tickets: Ticket[] = response.data;

    clearTickets();

    // EMPTY
    if (!tickets.length) {
      renderEmpty();
      return;
    }

    // SUCCESS
    renderSuccess(
      `Loaded ${tickets.length} tickets successfully`,
    );

    renderTickets(tickets, handleDelete);
  } catch (e: any) {
    // ERROR
    renderError(e.message);
  }
}

async function handleDelete(id: number) {
  const confirmed = confirm(
    "Delete ticket?",
  );

  if (!confirmed) return;

  try {
    renderLoading();

    await deleteTicket(id);

    renderSuccess("Ticket deleted");

    await loadTickets();
  } catch (e: any) {
    renderError(e.message);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    if (subjectInput.value.trim().length < 3) {
      renderError(
        "Subject must contain at least 3 characters",
      );

      return;
    }

    renderLoading();

    await createTicket({
      subject: subjectInput.value,
      message: messageInput.value,
      priority: "Low",
      authorId: 10,
      statusId: 2,
    });

    renderSuccess("Ticket created");

    form.reset();

    await loadTickets();
  } catch (e: any) {
    renderError(e.message);
  }
});

loadTickets();