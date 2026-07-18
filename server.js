const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

         //  In-memory "database" 
let tasks = [
    { id: 1, title: "Set up the project repo", description: "Initialize Express server and folder structure", priority: "high", completed: true, createdAt: new Date().toISOString() },
    { id: 2, title: "Design the REST API routes", description: "Plan out GET, POST, PUT, DELETE endpoints", priority: "medium", completed: true, createdAt: new Date().toISOString() },
    { id: 3, title: "Connect front-end with fetch()", description: "Wire up the UI so it talks to the API dynamically", priority: "high", completed: false, createdAt: new Date().toISOString() },
];
let nextId = 4;


function findTask(id) {
    return tasks.find((t) => t.id === Number(id));
}

function validateTask({ title, priority }, { partial = false } = {}) {
    const errors = {};

    if (!partial || title !== undefined) {
        if (!title || !title.trim()) {
            errors.title = "Title is required";
        } else if (title.trim().length < 3) {
            errors.title = "Title must be at least 3 characters";
        }
    }

    if (priority !== undefined && !["low", "medium", "high"].includes(priority)) {
        errors.priority = "Priority must be low, medium, or high";
    }

    return errors;
}


                // REST API — /api/tasks



app.get("/api/tasks", (req, res) => {
    const { status } = req.query;
    let result = tasks;

    if (status === "pending") result = tasks.filter((t) => !t.completed);
    if (status === "completed") result = tasks.filter((t) => t.completed);

    res.json({ success: true, count: result.length, tasks: result });
});


app.get("/api/tasks/:id", (req, res) => {
    const task = findTask(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: "Task not found" });
    res.json({ success: true, task });
});

// CREATE
app.post("/api/tasks", (req, res) => {
    const { title, description = "", priority = "medium" } = req.body;
    const errors = validateTask({ title, priority });

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    const newTask = {
        id: nextId++,
        title: title.trim(),
        description: description.trim(),
        priority,
        completed: false,
        createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    res.status(201).json({ success: true, task: newTask });
});

          // UPDATE
app.put("/api/tasks/:id", (req, res) => {
    const task = findTask(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: "Task not found" });

    const { title, description, priority, completed } = req.body;
    const errors = validateTask({ title, priority });

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (priority !== undefined) task.priority = priority;
    if (completed !== undefined) task.completed = Boolean(completed);

    res.json({ success: true, task });
});

        // PARTIAL UPDATE
app.patch("/api/tasks/:id/toggle", (req, res) => {
    const task = findTask(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: "Task not found" });

    task.completed = !task.completed;
    res.json({ success: true, task });
});

        // DELETE
app.delete("/api/tasks/:id", (req, res) => {
    const index = tasks.findIndex((t) => t.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, error: "Task not found" });

    const [deleted] = tasks.splice(index, 1);
    res.json({ success: true, task: deleted });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
