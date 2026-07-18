const API_BASE = "/api/tasks";

    const taskForm = document.getElementById("taskForm");
    const titleInput = document.getElementById("titleInput");
    const descriptionInput = document.getElementById("descriptionInput");
    const priorityInput = document.getElementById("priorityInput");
    const submitBtn = document.getElementById("submitBtn");

  const taskList = document.getElementById("taskList");
  const taskTemplate = document.getElementById("taskTemplate");
  const emptyState = document.getElementById("emptyState");
  const loadingState = document.getElementById("loadingState");
  const banner = document.getElementById("banner");
  const filterBar = document.getElementById("filterBar");

const statTotal = document.getElementById("statTotal");
const statPending = document.getElementById("statPending");
const statCompleted = document.getElementById("statCompleted");

let allTasks = [];
let currentFilter = "all";


        // API helpers — every call goes through fetch() against the
            // Express REST endpoints defined in server.js

async function apiRequest(url, options = {}) {
    const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const err = new Error(data.error || "Request failed");
        err.errors = data.errors || {};
        throw err;
    }
    return data;
}

const getTasks = () => apiRequest(API_BASE);
const createTask = (payload) => apiRequest(API_BASE, { method: "POST", body: JSON.stringify(payload) });
const updateTask = (id, payload) => apiRequest(`${API_BASE}/${id}`, { method: "PUT", body: JSON.stringify(payload) });
const toggleTask = (id) => apiRequest(`${API_BASE}/${id}/toggle`, { method: "PATCH" });
const deleteTask = (id) => apiRequest(`${API_BASE}/${id}`, { method: "DELETE" });
 
                 // Rendering

function showBanner(message, type = "success") {
    banner.textContent = message;
    banner.className = `mb-6 rounded-lg px-4 py-3 text-sm font-medium banner-${type}`;
    clearTimeout(showBanner._t);
    showBanner._t = setTimeout(() => banner.classList.add("hidden"), 2500);
}

function updateStats(tasks) {
    const completed = tasks.filter((t) => t.completed).length;
    statTotal.textContent = tasks.length;
    statCompleted.textContent = completed;
    statPending.textContent = tasks.length - completed;
}

function getVisibleTasks() {
    if (currentFilter === "pending") return allTasks.filter((t) => !t.completed);
    if (currentFilter === "completed") return allTasks.filter((t) => t.completed);
    return allTasks;
}

function renderTasks() {
    const visible = getVisibleTasks();
    updateStats(allTasks);

    taskList.innerHTML = "";
    emptyState.classList.toggle("hidden", visible.length !== 0);

    visible.forEach((task) => {
        const node = taskTemplate.content.cloneNode(true);
        const card = node.querySelector(".task-card");
        card.dataset.id = task.id;
        card.classList.toggle("is-completed", task.completed);

            const checkbox = node.querySelector(".toggle-checkbox");
            checkbox.checked = task.completed;

        node.querySelector(".task-title").textContent = task.title;
        node.querySelector(".task-description").textContent = task.description || "No description";

        const badge = node.querySelector(".priority-badge");
           badge.textContent = task.priority;
    badge.classList.add(`priority-${task.priority}`);

       
        checkbox.addEventListener("change", () => handleToggle(task.id));
        node.querySelector(".delete-btn").addEventListener("click", () => handleDelete(task.id));
        node.querySelector(".edit-btn").addEventListener("click", (e) => enterEditMode(e.target.closest(".task-card"), task));
        node.querySelector(".cancel-btn").addEventListener("click", (e) => exitEditMode(e.target.closest(".task-card")));
        node.querySelector(".save-btn").addEventListener("click", (e) => handleSaveEdit(e.target.closest(".task-card"), task.id));

        taskList.appendChild(node);
    });
}

function enterEditMode(card, task) {
    card.querySelector(".view-mode").classList.add("hidden");
    card.querySelector(".edit-mode").classList.remove("hidden");
      card.querySelector(".edit-btn").classList.add("hidden");
    card.querySelector(".delete-btn").classList.add("hidden");
    card.querySelector(".save-btn").classList.remove("hidden");
        card.querySelector(".cancel-btn").classList.remove("hidden");

    card.querySelector(".edit-title").value = task.title;
      card.querySelector(".edit-description").value = task.description;
   card.querySelector(".edit-priority").value = task.priority;
}

function exitEditMode(card) {
       card.querySelector(".view-mode").classList.remove("hidden");
    card.querySelector(".edit-mode").classList.add("hidden");
               card.querySelector(".edit-btn").classList.remove("hidden");
            card.querySelector(".delete-btn").classList.remove("hidden");
            card.querySelector(".save-btn").classList.add("hidden");
    card.querySelector(".cancel-btn").classList.add("hidden");
}


// Event handlers — each one calls the API, then re-syncs
// the in-memory list from the response so the DOM updates
// dynamically without a page reload

async function loadTasks() {
    loadingState.classList.remove("hidden");
    try {
        const data = await getTasks();
        allTasks = data.tasks;
        renderTasks();
    } catch (err) {
        showBanner("Could not load tasks from the server", "error");
    } finally {
        loadingState.classList.add("hidden");
    }
}

taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearFieldError("title");

    const payload = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        priority: priorityInput.value,
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Adding…";

    try {
        const data = await createTask(payload);
        allTasks.push(data.task);
        renderTasks();
        taskForm.reset();
        priorityInput.value = "medium";
        showBanner("Task added");
    } catch (err) {
        if (err.errors?.title) showFieldError("title", err.errors.title);
        else showBanner(err.message, "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Add Task";
    }
});

async function handleToggle(id) {
    try {
        const data = await toggleTask(id);
        allTasks = allTasks.map((t) => (t.id === id ? data.task : t));
        renderTasks();
    } catch (err) {
        showBanner("Could not update task", "error");
    }
}

async function handleSaveEdit(card, id) {
    const title = card.querySelector(".edit-title").value.trim();
    const description = card.querySelector(".edit-description").value.trim();
    const priority = card.querySelector(".edit-priority").value;

    try {
        const data = await updateTask(id, { title, description, priority });
        allTasks = allTasks.map((t) => (t.id === id ? data.task : t));
        renderTasks();
        showBanner("Task updated");
    } catch (err) {
        showBanner(err.errors?.title || err.message || "Could not update task", "error");
    }
}

async function handleDelete(id) {
    const card = taskList.querySelector(`.task-card[data-id="${id}"]`);
    card?.classList.add("removing");

    try {
        await deleteTask(id);
        setTimeout(() => {
            allTasks = allTasks.filter((t) => t.id !== id);
            renderTasks();
        }, 180);
        showBanner("Task deleted");
    } catch (err) {
        card?.classList.remove("removing");
        showBanner("Could not delete task", "error");
    }
}

                     // Filter tabs

filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active-filter"));
    btn.classList.add("active-filter");
    currentFilter = btn.dataset.filter;
    renderTasks();
});


function showFieldError(field, message) {
    const errorEl = document.querySelector(`[data-error-for="${field}"]`);
    const inputEl = document.getElementById(`${field}Input`);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove("hidden");
    }
    inputEl?.classList.add("field-invalid");
}

function clearFieldError(field) {
    const errorEl = document.querySelector(`[data-error-for="${field}"]`);
    const inputEl = document.getElementById(`${field}Input`);
    errorEl?.classList.add("hidden");
    inputEl?.classList.remove("field-invalid");
}

titleInput.addEventListener("input", () => clearFieldError("title"));

loadTasks();
