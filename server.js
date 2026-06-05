const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Form data read karne ke liye
app.use(express.urlencoded({ extended: true }));


app.use(express.static("public"));

// EJS set karna
app.set("view engine", "ejs");

// Home Page
app.get("/", (req, res) => {
    res.render("index");
});

// Form Submit Route
app.post("/submit", (req, res) => {

    const username = req.body.username;
    const message = req.body.message;
    const email = req.body.email;

    res.render("result", {
        username,
        email,
        message
    });
});

// Server Start
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});