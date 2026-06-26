const express = require("express");
const validator = require("validator");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let registeredUsers = [];

// Main page
app.get("/", (req, res) => {
    res.render("index", { errors: {}, old: {}, success: false, registered: null });
});

// Form submit
app.post("/", (req, res) => {
    const { username, email, password, confirmPassword, age } = req.body;
    let errors = {};

    if (validator.isEmpty(username || "")) {
        errors.username = "Username is required";
    } else if (!validator.isLength(username, { min: 3 })) {
        errors.username = "Username must be at least 3 characters";
    }

    if (validator.isEmpty(email || "")) {
        errors.email = "Email is required";
    } else if (!validator.isEmail(email)) {
        errors.email = "Please enter a valid email address";
    }

    if (validator.isEmpty(age || "")) {
        errors.age = "Age is required";
    } else if (!validator.isInt(age, { min: 13, max: 100 })) {
        errors.age = "Age must be between 13 and 100";
    }

    if (validator.isEmpty(password || "")) {
        errors.password = "Password is required";
    } else if (!validator.isLength(password, { min: 6 })) {
        errors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
        return res.render("index", { errors, old: { username, email, age }, success: false, registered: null });
    }

    const newUser = { id: registeredUsers.length + 1, username, email, age };
    registeredUsers.push(newUser);

    res.render("index", { errors: {}, old: {}, success: true, registered: newUser });
});

// Users page
app.get("/users", (req, res) => {
    res.render("users", { users: registeredUsers });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
