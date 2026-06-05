# Task 1 - HTML Form with Node.js + Express + EJS

A simple web app where a user fills a form and the submitted data is shown on a new page using server-side rendering.

---

## What This Project Does

1. User opens the form page
2. Fills in Name, Email, and Message
3. Clicks Submit
4. Server receives the data and shows it on a new page

No database. No React. Just pure HTML form + Node.js server.

---

## Project Structure

```
Task1/
├── public/
│   └── style.css        ← Styling
├── views/
│   ├── index.ejs        ← Form Page
│   └── result.ejs       ← Submitted Data Page
├── .gitignore
├── package.json
└── server.js            ← Main Server File
```

---

## How to Run

**Step 1 - Install dependencies**
```bash
npm install
```

**Step 2 - Start the server**
```bash
node server.js
```

**Step 3 - Open in browser**
```
http://localhost:3000
```

---

## Routes

| Method | Route | What it does |
|--------|-------|-------------|
| GET | `/` | Shows the form |
| POST | `/submit` | Receives form data and shows result |

---

## Technologies Used

- Node.js
- Express
- EJS (Embedded JavaScript Templates)
- HTML & CSS