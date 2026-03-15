//state
const state = {
    tickets: [],
    nextId: 1,
    editingId: null,
    searchQuery: "",
    sortField: "",
    sortDirection: "asc",
    loading: false
};

//зберігання в пам'яті
function saveToStorage() {
    localStorage.setItem("tickets", JSON.stringify(state.tickets));
}

function loadFromStorage() {
    const data = localStorage.getItem("tickets");

    if (data) {
        state.tickets = JSON.parse(data);
        
        if (state.tickets.length) {
            state.nextId =
                Math.max(...state.tickets.map(t => t.id)) + 1;
        }
    }
}

//DOM-elements
const form = document.getElementById("ticketForm");
const table = document.getElementById("ticketTable");
const loading = document.getElementById("loading");

function setLoading(value) {
    state.loading = value;
    loading.style.display = value ? "block" : "none";
}


function readForm() {
    return {
        subject: document.getElementById("subject").value.trim(),
        status: document.getElementById("status").value,
        priority: document.getElementById("priority").value,
        message: document.getElementById("message").value.trim(),
        author: document.getElementById("author").value
    };
}

//валідація
function validate(data) {

    let valid = true;
    clearErrors();

    if (data.subject.length < 4) {
        setError("subject", "Minimum 4 symbols");
        valid = false;
    }

    if (!data.status) {
        setError("status", "Choose status");
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

    if (!data.author) {
        setError("author", "Choose name");
        valid = false;
    }

    return valid;
}

function setError(field, message) {
    const input = document.getElementById(field);
    input.classList.add("invalid");
    document.getElementById(field + "Error").textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".invalid")
        .forEach(el => el.classList.remove("invalid"));

    document.querySelectorAll(".error-text")
        .forEach(el => el.textContent = "");
}

// перевірка на дублікат
function isDuplicate(subject) {

    return state.tickets.some(ticket =>
        ticket.subject.toLowerCase() === subject.toLowerCase()
    );
}

//add item
function addItem(data) {

    if (isDuplicate(data.subject)) {
        setError("subject", "Ticket already exists");
        return false;
    }

    const ticket = {
        id: state.nextId++,
        subject: data.subject,
        status: data.status,
        priority: data.priority,
        message: data.message,
        author: data.author
    };

    state.tickets.push(ticket);
    saveToStorage();

    return true;
}

function editItem(id) {

    clearErrors();
    const ticket = state.tickets.find(t => t.id === id);
    if (!ticket) return;

    document.getElementById("subject").value = ticket.subject;
    document.getElementById("priority").value = ticket.priority;
    document.getElementById("message").value = ticket.message;
    document.getElementById("status").value = ticket.status;
    document.getElementById("author").value = ticket.author;

    state.editingId = id;

    form.querySelector("button[type='submit']").textContent = "Save";
}

function updateItem(data) {
    const index = state.tickets.findIndex(t => t.id === state.editingId);
    if (index === -1) return;

    state.tickets[index] = {
        id: state.editingId,
        subject: data.subject,
        status: data.status,
        priority: data.priority,
        message: data.message,
        author: data.author
    };
    saveToStorage();
}

function deleteItem(id) {
    state.tickets = state.tickets.filter(t => t.id !== id);

    if (state.editingId === id) {
        state.editingId = null;
        form.reset();
        clearErrors();
    }

    saveToStorage();
}

//render (інтерфейс)
function renderTickets() {

    table.innerHTML = "";

    let ticketsToShow = [...state.tickets];

    //пошук
    if (state.searchQuery) {
        ticketsToShow =
            ticketsToShow.filter(t =>
                t.subject
                    .toLowerCase()
                    .includes(state.searchQuery.toLowerCase())
            );
    }


    if (state.sortField) {
        ticketsToShow.sort((a, b) => {
            let valueA = a[state.sortField];
            let valueB = b[state.sortField];

            if (typeof valueA == "string") {
                valueA = valueA.toLowerCase()
                valueB = valueB.toLowerCase()


                if (valueA > valueB) return state.sortDirection == "asc" ? 1 : -1;
                if (valueA < valueB) return state.sortDirection == "asc" ? -1 : 1;

                return 0;
            }
            if (typeof valueA == "number"){
                if (valueA > valueB) return state.sortDirection == "asc" ? 1 : -1;
                if (valueA < valueB) return state.sortDirection == "asc" ? -1 : 1;

                return 0;
            }
                
    });
    }


    ticketsToShow.forEach(ticket => {

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${ticket.id}</td>
        <td>${ticket.subject}</td>
        <td>${ticket.status}</td>
        <td>${ticket.priority}</td>
        <td>${ticket.author}</td>
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

//handlers (реакція на подію)
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = readForm();
    if (!validate(formData)) return;

    setLoading(true);

    setTimeout(() => {

        if (state.editingId !== null) {
            updateItem(formData);
        }
        else {
            if (!addItem(formData)) {
                setLoading(false);
                return;
            }
        }
        state.editingId = null;
        form.reset();
        clearErrors();
        setLoading(false);
        renderTickets();

    }, 500);
});

table.addEventListener("click", e => {

    if (e.target.classList.contains("delete-btn")) {
        const id = Number(e.target.dataset.id);
        deleteItem(id);
        form.querySelector("button[type='submit']").textContent = "add";
        renderTickets();
    }

    if (e.target.classList.contains("edit-btn")) {
        const id = Number(e.target.dataset.id);
        const ticket =
            state.tickets.find(t => t.id === id);

        if (!ticket) return;

        document.getElementById("subject").value = ticket.subject;
        document.getElementById("status").value = ticket.status;
        document.getElementById("priority").value = ticket.priority;
        document.getElementById("message").value = ticket.message;
        document.getElementById("author").value = ticket.author;

        state.editingId = id;
    }
});

//помилки вводу
document.querySelectorAll("input, textarea, select")
    .forEach(el => {
        el.addEventListener("input", () => {
            el.classList.remove("invalid");
            const error = document.getElementById(el.id + "Error");
            if (error) error.textContent = "";
        });
    });

//пошук
document.getElementById("searchInput")
    .addEventListener("input", e => {
        state.searchQuery = e.target.value;
        renderTickets();
    });


//сортування
document.querySelectorAll("th[data-field]").forEach(th =>{
th.addEventListener("click", e => {
    const field = th.dataset.field;
    if(state.sortField == field){
        state.sortDirection = state.sortDirection == "asc" ? "desc" : "asc";
    }
    else {
        state.sortField = field;
        state.sortDirection = "asc";
    }
        renderTickets();
    });
});

//start
loadFromStorage();
renderTickets();
