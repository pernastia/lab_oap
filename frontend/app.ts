import {
    getTickets,
    createTicket,
    updateTicket,
    deleteTicket
} from "./scr/api/apiClient.js";
import { Ticket as TicketType } from "./scr/types/ticket.js";
import { ApiError } from "./scr/types/apiError.js";

interface Ticket {
    id: number;
    subject: string;
    priority: string;
    message: string;
    authorId: number;
    statusId: number;
    authorName?: string;
    statusName?: string;
}

interface State {
    tickets: Ticket[];
    editingId: number | null;
    searchQuery: string;
    sortField: string;
    sortDirection: "asc" | "desc";
    loading: boolean;
    error: string | null;
}

const state: State = {
    tickets: [],
    editingId: null,
    searchQuery: "",
    sortField: "id",
    sortDirection: "desc",
    loading: false,
    error: null
};

const form = document.getElementById("ticketForm") as HTMLFormElement;
const table = document.getElementById("ticketTable") as HTMLTableElement;
const loading = document.getElementById("loading")!;
const empty = document.getElementById("emptyState")!;
const errorBox = document.getElementById("errorBox")!;

function setLoading(value: boolean) {
    state.loading = value;
    loading.style.display = value ? "block" : "none";
}

function showError(message: string) {
    state.error = message;
    errorBox.textContent = message;
    errorBox.style.display = "block";
}

function clearError() {
    state.error = null;
    errorBox.textContent = "";
    errorBox.style.display = "none";
}

function showEmpty(show: boolean) {
    empty.style.display = show ? "block" : "none";
}

function readForm(): Omit<Ticket, "id"> {
    return {
        subject: (document.getElementById("subject") as HTMLInputElement).value.trim(),
        priority: (document.getElementById("priority") as HTMLSelectElement).value,
        message: (document.getElementById("message") as HTMLTextAreaElement).value.trim(),
        authorId: Number((document.getElementById("author") as HTMLSelectElement).value),
        statusId: Number((document.getElementById("status") as HTMLSelectElement).value)
    };
}

function validate(data: ReturnType<typeof readForm>) {
    let valid = true;

    clearErrors();

    if (data.subject.length < 4) {
        setError("subject", "Minimum 4 symbols");
        valid = false;
    }

    if (!data.priority) {
        setError("priority", "Choose priority");
        valid = false;
    }

    if (data.message.length < 8) {
        setError("message", "Too short");
        valid = false;
    }

    if (!data.authorId) {
        setError("author", "Choose author");
        valid = false;
    }

    if (!data.statusId) {
        setError("status", "Choose status");
        valid = false;
    }

    return valid;
}

function setError(field: string, message: string) {
    const input = document.getElementById(field);
    if (input) {
        input.classList.add("invalid");
    }

    const error = document.getElementById(field + "Error");
    if (error) {
        error.textContent = message;
    }
}

function clearErrors() {
    document.querySelectorAll(".invalid")
        .forEach(el => el.classList.remove("invalid"));

    document.querySelectorAll(".error-text")
        .forEach(el => el.textContent = "");
}

async function loadTickets() {
    try {
        clearError();
        setLoading(true);

        const data = await getTickets(
            state.sortField,
            state.sortDirection
        );

        state.tickets = data as TicketType[];
        renderTickets();

    } catch (error: unknown) {
        const apiError = error as ApiError;
        if (apiError.message && apiError.message.includes("Failed to fetch")) {
            showError("Backend unavailable");
        } else {
            showError(apiError.message || "Unknown error");
        }
    } finally {
        setLoading(false);
    }
}

function renderTickets() {
    table.innerHTML = "";

    let ticketsToShow = [...state.tickets];

    if (state.searchQuery) {
        ticketsToShow = ticketsToShow.filter(ticket =>
            ticket.subject
                .toLowerCase()
                .includes(state.searchQuery.toLowerCase())
        );
    }

    // empty state
    if (ticketsToShow.length === 0) {
        showEmpty(true);
        return;
    }

    showEmpty(false);

    ticketsToShow.forEach(ticket => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${ticket.id}</td>
            <td>${ticket.subject}</td>
            <td>${ticket.priority}</td>
            <td>${ticket.authorName ?? "-"}</td>
            <td>${ticket.statusName ?? "-"}</td>
            <td>${ticket.message}</td>
            <td>
                <button class="edit-btn" data-id="${ticket.id}">
                    Edit
                </button>
                <button class="delete-btn" data-id="${ticket.id}">
                    Delete
                </button>
            </td>
        `;

        table.appendChild(row);
    });
}

// form submit
form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    clearError();

    const formData = readForm();

    if (!validate(formData)) {
        return;
    }

    try {
        setLoading(true);

        if (state.editingId !== null) {
            await updateTicket(state.editingId, formData);
        } else {
            await createTicket({ ...formData});
        }

        form.reset();
        state.editingId = null;

        const submitBtn = form.querySelector("button[type='submit']");
        if (submitBtn) submitBtn.textContent = "Add";

        await loadTickets();

    } catch (error: unknown) {
        const apiError = error as ApiError;
        showError(apiError.message || "Error submitting form");
    } finally {
        setLoading(false);
    }
});

table.addEventListener("click", async (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (target.classList.contains("delete-btn")) {
        const id = Number(target.dataset.id);
        const confirmed = confirm("Delete ticket?");

        if (!confirmed) return;

        try {
            setLoading(true);
            await deleteTicket(id);
            await loadTickets();
        } catch (error: unknown) {
            const apiError = error as ApiError;
            showError(apiError.message || "Error deleting ticket");
        } finally {
            setLoading(false);
        }
    }

    if (target.classList.contains("edit-btn")) {
        const id = Number(target.dataset.id);
        const ticket = state.tickets.find(t => t.id === id);

        if (!ticket) return;

        (document.getElementById("subject") as HTMLInputElement).value = ticket.subject;
        (document.getElementById("priority") as HTMLSelectElement).value = ticket.priority;
        (document.getElementById("message") as HTMLTextAreaElement).value = ticket.message;
        (document.getElementById("author") as HTMLSelectElement).value = String(ticket.authorId);
        (document.getElementById("status") as HTMLSelectElement).value = String(ticket.statusId);

        state.editingId = id;

        const submitBtn = form.querySelector("button[type='submit']");
        if (submitBtn) submitBtn.textContent = "Save";
    }
});

// remove validation error while typing
document.querySelectorAll("input, textarea, select")
    .forEach(el => {
        el.addEventListener("input", () => {
            el.classList.remove("invalid");
            const error = document.getElementById(el.id + "Error");
            if (error) {
                error.textContent = "";
            }
        });
    });

const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("input", (e: Event) => {
        const target = e.target as HTMLInputElement;
        state.searchQuery = target.value;
        renderTickets();
    });
}

document.querySelectorAll("th[data-field]")
    .forEach(th => {
        th.addEventListener("click", async () => {
            const element = th as HTMLElement;
            const field = element.dataset.field;

            if (!field) return;

            if (state.sortField === field) {
                state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
            } else {
                state.sortField = field;
                state.sortDirection = "asc";
            }

            await loadTickets();
        });
    });

loadTickets();