const express = require("express");
const validator = require("validator");

const app = express();
const PORT = 3000;

// Form data read karne ke liye
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// EJS set karna
app.set("view engine", "ejs");

// In-memory storage - validated form data yahan store hoga
let registeredUsers = [];

// Home Page - Form dikhana
app.get("/", (req, res) => {
    res.render("index", { errors: {}, old: {} });
});

// Form Submit Route
app.post("/register", (req, res) => {

    const { username, email, password, confirmPassword, age } = req.body;

    let errors = {};

    // Server Side Validation using validator

    // Username check
    if (validator.isEmpty(username || "")) {
        errors.username = "Username is required";
    } else if (!validator.isLength(username, { min: 3 })) {
        errors.username = "Username must be at least 3 characters";
    }

    // Email check
    if (validator.isEmpty(email || "")) {
        errors.email = "Email is required";
    } else if (!validator.isEmail(email)) {
        errors.email = "Please enter a valid email address";
    }

    // Age check
    if (validator.isEmpty(age || "")) {
        errors.age = "Age is required";
    } else if (!validator.isInt(age, { min: 13, max: 100 })) {
        errors.age = "Age must be a number between 13 and 100";
    }

    // Password check
    if (validator.isEmpty(password || "")) {
        errors.password = "Password is required";
    } else if (!validator.isLength(password, { min: 6 })) {
        errors.password = "Password must be at least 6 characters";
    }

    // Confirm Password check
    if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    // Agar errors hain, form fir se dikhao errors ke saath
    if (Object.keys(errors).length > 0) {
        return res.render("index", {
            errors,
            old: { username, email, age }
        });
    }

    // Validated data ko array mein store karna (in-memory)
    const newUser = {
        id: registeredUsers.length + 1,
        username,
        email,
        age
    };
    registeredUsers.push(newUser);

    console.log("Stored Users:", registeredUsers);

    // Result page dikhana
    res.render("result", { user: newUser });
});

// Saare stored users dekhne ke liye
app.get("/users", (req, res) => {
    res.render("users", { users: registeredUsers });
});

// Server Start
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
