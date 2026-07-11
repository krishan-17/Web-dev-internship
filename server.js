const express = require("express");
const validator = require("validator");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let registeredUsers = [];

// ---- Shared validation logic (used by both normal form POST and AJAX API) ----
function validateUser({ username, email, age, password, confirmPassword }) {
    let errors = {};

    if (validator.isEmpty(username || "")) {
        errors.username = "Username is required";
    } else if (!validator.isLength(username, { min: 3 })) {
        errors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.username = "Only letters, numbers and underscores are allowed";
    }

    if (validator.isEmpty(email || "")) {
        errors.email = "Email is required";
    } else if (!validator.isEmail(email)) {
        errors.email = "Please enter a valid email address";
    }

    if (validator.isEmpty(String(age ?? ""))) {
        errors.age = "Age is required";
    } else if (!validator.isInt(String(age), { min: 13, max: 100 })) {
        errors.age = "Age must be between 13 and 100";
    }

    if (validator.isEmpty(password || "")) {
        errors.password = "Password is required";
    } else if (!validator.isLength(password, { min: 6 })) {
        errors.password = "Password must be at least 6 characters";
    } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        errors.password = "Use upper & lower case letters and at least one number";
    }

    if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
}

// Main page
app.get("/", (req, res) => {
    res.render("index", { errors: {}, old: {}, success: false, registered: null });
});

// Form submit (classic, full page reload - fallback for when JS is disabled)
app.post("/", (req, res) => {
    const { username, email, password, confirmPassword, age } = req.body;
    const errors = validateUser({ username, email, age, password, confirmPassword });

    if (Object.keys(errors).length > 0) {
        return res.render("index", { errors, old: { username, email, age }, success: false, registered: null });
    }

    const newUser = { id: registeredUsers.length + 1, username, email, age };
    registeredUsers.push(newUser);

    res.render("index", { errors: {}, old: {}, success: true, registered: newUser });
});

// ---- AJAX API used by script.js for dynamic, no-reload registration ----
app.post("/api/register", (req, res) => {
    const { username, email, password, confirmPassword, age } = req.body;
    const errors = validateUser({ username, email, age, password, confirmPassword });

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    const newUser = { id: registeredUsers.length + 1, username, email, age };
    registeredUsers.push(newUser);

    res.status(201).json({ success: true, user: newUser });
});

// Return the current in-memory users list as JSON (used by the Users section / hash route)
app.get("/api/users", (req, res) => {
    res.json({ users: registeredUsers });
});

// Users page (classic full page view, still works without JS)
app.get("/users", (req, res) => {
    res.render("users", { users: registeredUsers });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
