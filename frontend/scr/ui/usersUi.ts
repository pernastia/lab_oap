import { User } from "../types/user.js";

const usersList = document.getElementById(
    "usersList"
) as HTMLUListElement;

export function renderUsers(
    users: User[]
) {
    usersList.innerHTML = "";

    users.forEach(user => {

        const li = document.createElement("li");

        li.textContent = `
            ${user.id} - ${user.name}
        `;

        usersList.appendChild(li);
    });
}
