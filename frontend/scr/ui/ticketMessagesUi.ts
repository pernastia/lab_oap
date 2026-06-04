import { TicketMessage } from "../types/ticketMessages.js";

const messagesList = document.getElementById(
    "messagesList"
) as HTMLUListElement;

export function renderTicketMessages(
    messages: TicketMessage[]
) {
    messagesList.innerHTML = "";

    messages.forEach(message => {

        const li = document.createElement("li");

        li.textContent = `
            ${message.text}
        `;

        messagesList.appendChild(li);
    });
}
