import { Ticket } from "../scr/types/ticket.js";

const list = document.getElementById(
  "tickets-list",
) as HTMLUListElement;

const statusEl = document.getElementById(
  "status",
) as HTMLDivElement;

export function renderLoading() {
  statusEl.textContent = "Loading...";
}

export function renderSuccess(message: string) {
  statusEl.textContent = message;
}

export function renderError(message: string) {
  statusEl.textContent = message;
}

export function renderEmpty() {
  statusEl.textContent = "No tickets found";
}

export function clearTickets() {
  list.innerHTML = "";
}

export function renderTickets(
  tickets: Ticket[],
  onDelete: (id: number) => void,
) {
  clearTickets();

  // EMPTY STATE
  if (!tickets.length) {
    renderEmpty();
    return;
  }

  // SUCCESS STATE
  renderSuccess("Tickets loaded");

  tickets.forEach((ticket) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <h3>${ticket.subject}</h3>
      <p>${ticket.message}</p>
      <small>${ticket.priority}</small>

      <br><br>

      <button>
        Delete
      </button>
    `;

    const button = li.querySelector(
      "button",
    ) as HTMLButtonElement;

    button.addEventListener("click", () => {
      onDelete(ticket.id);
    });

    list.appendChild(li);
  });
}