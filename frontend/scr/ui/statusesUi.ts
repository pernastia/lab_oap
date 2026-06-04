import { Status } from "../types/status.js";

const statusesList = document.getElementById(
    "statusesList"
) as HTMLUListElement;

export function renderStatuses(
    statuses: Status[]
) {
    statusesList.innerHTML = "";

    statuses.forEach(status => {

        const li = document.createElement("li");

        li.textContent = `
            ${status.id} - ${status.name}
        `;

        statusesList.appendChild(li);
    });
}
