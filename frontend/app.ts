import { getTickets, createTicket, updateTicket, deleteTicket, getStatuses, getMessages } from "./scr/api/apiClient.js";
import { getUsers, createUser, updateUser, deleteUser } from "./scr/api/usersApi.js";

interface Ticket {
  id: number;
  subject: string;
  priority: string;
  message: string;
  authorId: number;
  authorName?: string;
  statusId: number;
  statusName?: string;
}

interface TicketPayload {
  subject: string;
  priority: string;
  message: string;
  authorId: number;
  statusId: number;
}

interface User {
  id: number;
  name: string;
}

type AlertType = "error" | "success" | "info" | "warning";
type SortDirection = "asc" | "desc";

interface TicketState {
  tickets: Ticket[];
  editingId: number | null;
  searchQuery: string;
  sortField: string;
  sortDirection: SortDirection;
}

interface UserState {
  users: User[];
  editingId: number | null;
}

const ticketState: TicketState = {
  tickets: [],
  editingId: null,
  searchQuery: "",
  sortField: "id",
  sortDirection: "desc",
};

const userState: UserState = { users: [], editingId: null };

async function init() {
  try {
    await loadUsers();
    await loadTickets();
    const response = await getStatuses() as { data: { id: number, name: string }[] };
    const statusSelect = document.getElementById("status") as HTMLSelectElement;
    if (statusSelect) {
      statusSelect.innerHTML = '<option value="">select</option>' + response.data.map(s => 
        `<option value="${s.id}">${s.name}</option>`
      ).join('');
    }
  } catch (e) {
    console.error("Statuses load failed", e);
  }
}

function badgeStatus(name?: string): string {
  if (!name) return "-";
  const map: Record<string, string> = {
    open: "badge-open",
    closed: "badge-closed",
    "in progress": "badge-progress",
  };
  const cls = map[name.toLowerCase()] ?? "badge-open";
  return `<span class="badge ${cls}">${name}</span>`;
}

function badgePriority(name?: string): string {
  if (!name) return "-";
  const map: Record<string, string> = {
    high: "badge-high",
    medium: "badge-medium",
    low: "badge-low",
  };
  const cls = map[name.toLowerCase()] ?? "badge-medium";
  return `<span class="badge ${cls}">${name}</span>`;
}

function showAlert(id: string, msg: string, type: AlertType = "error"): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = `alert alert-${type}`;
  el.style.display = "block";
  setTimeout(() => (el.style.display = "none"), 4000);
}

function setFieldError(field: string, msg: string): void {
  const input = document.getElementById(field);
  if (input) input.classList.add("invalid");
  const err = document.getElementById(field + "Error");
  if (err) err.textContent = msg;
}

function clearFieldErrors(fields: string[]): void {
  fields.forEach((f) => {
    const input = document.getElementById(f);
    if (input) input.classList.remove("invalid");
    const err = document.getElementById(f + "Error");
    if (err) err.textContent = "";
  });
}

async function loadTickets(): Promise<void> {
  const loading = document.getElementById("ticketLoading");
  if (loading) loading.style.display = "block";
  try {
    const data = await getTickets(ticketState.sortField, ticketState.sortDirection);
    ticketState.tickets = (data as { data?: Ticket[] })?.data ?? (data as Ticket[]) ?? [];
    renderTickets();
  } catch (e) {
    showAlert("ticketAlert", (e as Error).message || "Error loading tickets");
  } finally {
    if (loading) loading.style.display = "none";
  }
}

function renderTickets(): void {
  const table = document.getElementById("ticketTable");
  const empty = document.getElementById("ticketEmpty");
  if (!table || !empty) return;
  table.innerHTML = "";

  let list = [...ticketState.tickets];
  if (ticketState.searchQuery) {
    list = list.filter((t) =>
      t.subject.toLowerCase().includes(ticketState.searchQuery.toLowerCase())
    );
  }

  if (!list.length) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  list.forEach((ticket) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span style="font-family:var(--font-mono);color:var(--muted)">#${ticket.id}</span></td>
      <td>${ticket.subject}</td>
      <td>${badgeStatus(ticket.statusName)}</td>
      <td>${badgePriority(ticket.priority)}</td>
      <td>${ticket.authorName ?? "-"}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${ticket.message}">${ticket.message}</td>
      <td><div class="actions-cell">
        <button class="btn btn-edit edit-btn" data-id="${ticket.id}">Edit</button>
        <button class="btn btn-danger delete-btn" data-id="${ticket.id}">Delete</button>
      </div></td>
    `;
    table.appendChild(tr);
  });
}

document.getElementById("ticketForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearFieldErrors(["subject", "status", "priority", "message", "author"]);

  const data: TicketPayload = {
    subject: (document.getElementById("subject") as HTMLInputElement).value.trim(),
    priority: (document.getElementById("priority") as HTMLSelectElement).value,
    message: (document.getElementById("message") as HTMLTextAreaElement).value.trim(),
    authorId: Number((document.getElementById("author") as HTMLSelectElement).value),
    statusId: Number((document.getElementById("status") as HTMLSelectElement).value),
  };

  let valid = true;
  if (data.subject.length < 4) { setFieldError("subject", "Minimum 4 symbols"); valid = false; }
  if (!data.priority) { setFieldError("priority", "Choose priority"); valid = false; }
  if (data.message.length < 8) { setFieldError("message", "Too short"); valid = false; }
  if (!data.authorId) { setFieldError("author", "Choose author"); valid = false; }
  if (!data.statusId) { setFieldError("status", "Choose status"); valid = false; }
  if (!valid) return;

  try {
    if (ticketState.editingId !== null) {
      await updateTicket(ticketState.editingId, data);
      showAlert("ticketAlert", "Ticket updated", "success");
    } else {
      await createTicket(data);
      showAlert("ticketAlert", "Ticket created", "success");
    }
    (document.getElementById("ticketForm") as HTMLFormElement).reset();
    ticketState.editingId = null;
    await loadTickets();
  } catch (e) {
    showAlert("ticketAlert", (e as Error).message || "Error");
  }
});

document.getElementById("ticketTable")?.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains("delete-btn")) {
    if (!confirm("Delete ticket?")) return;
    try {
      await deleteTicket(Number(target.dataset.id));
      await loadTickets();
    } catch (e) {
      showAlert("ticketAlert", (e as Error).message);
    }
  }
  if (target.classList.contains("edit-btn")) {
    const ticketId = Number(target.dataset.id);
    const ticket = ticketState.tickets.find((t) => t.id === ticketId);
    if (!ticket) return;
    
    if (userState.users.length === 0) await loadUsers();
    
    try {
        const msgs = await getMessages(ticketId);
        console.log("History:", msgs);
    } catch (err) { console.error(err); }

    (document.getElementById("subject") as HTMLInputElement).value = ticket.subject;
    (document.getElementById("priority") as HTMLSelectElement).value = ticket.priority;
    (document.getElementById("message") as HTMLTextAreaElement).value = ticket.message;
    (document.getElementById("author") as HTMLSelectElement).value = String(ticket.authorId);
    (document.getElementById("status") as HTMLSelectElement).value = String(ticket.statusId);
    
    ticketState.editingId = ticket.id;
    document.getElementById("tab-tickets")?.scrollIntoView({ behavior: "smooth" });
  }
});

async function loadUsers(): Promise<void> {
  try {
    userState.users = (await getUsers()) ?? [];
    renderUsers();
  } catch (e) {
    showAlert("userAlert", (e as Error).message || "Error loading users");
  }
}

function renderUsers(): void {
  const table = document.getElementById("userTable");
  const authorSelect = document.getElementById("author") as HTMLSelectElement;
  if (!table) return;
  table.innerHTML = "";

  if (authorSelect) {
    const currentVal = authorSelect.value;
    authorSelect.innerHTML = '<option value="">select</option>';
    userState.users.forEach((user) => {
      const opt = document.createElement("option");
      opt.value = String(user.id);
      opt.textContent = user.name;
      authorSelect.appendChild(opt);
    });
    authorSelect.value = currentVal;
  }

  userState.users.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>#${user.id}</td>
      <td>${user.name}</td>
      <td>
        <button class="btn btn-edit user-edit-btn" data-id="${user.id}">Edit</button>
        <button class="btn btn-danger user-delete-btn" data-id="${user.id}">Delete</button>
      </td>
    `;
    table.appendChild(tr);
  });
}

init();