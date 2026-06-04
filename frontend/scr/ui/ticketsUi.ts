import { Ticket } from "../types/ticket.js";

const table = document.getElementById(
    "ticketTable"
) as HTMLTableElement;

export function renderTickets(
    tickets: Ticket[]
) {
    table.innerHTML = "";

    tickets.forEach(ticket => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${ticket.id}</td>
            <td>${ticket.subject}</td>
            <td>${ticket.priority}</td>
            <td>${ticket.authorName ?? "-"}</td>
            <td>${ticket.statusName ?? "-"}</td>
            <td>${ticket.message}</td>
        `;

        table.appendChild(row);
    });
}
