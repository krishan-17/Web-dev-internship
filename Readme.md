# Task 2 - Form Styling and Validation

A registration form with multiple input types, client-side validation (inline JS), and server-side validation (Express + validator package). Validated data is stored temporarily in an in-memory array.

---

## What This Project Does

1. User opens the registration form
2. Fills in Username, Email, Age, Password, Confirm Password
3. Inline JavaScript checks the fields before the form is submitted (empty fields, valid email, password length, matching passwords)
4. Form data is sent to the server
5. Express checks all fields again using the `validator` npm package
6. If anything is invalid, the form is shown again with error messages and the previously entered values
7. If everything is valid, the data is stored in an in-memory array and a success page is shown

---

## Project Structure

```
Task2/
├── public/
│   └── style.css        ← Styling
├── views/
│   ├── index.ejs         ← Form Page (with client + server error display)
│   ├── result.ejs         ← Success Page
│   └── users.ejs           ← Shows all stored users (in-memory)
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
| GET | `/` | Shows the registration form |
| POST | `/register` | Validates and stores form data, shows result |
| GET | `/users` | Shows all registered users stored in memory |

---

## Validation Rules

- **Username**: required, minimum 3 characters
- **Email**: required, must be a valid email format
- **Age**: required, must be a number between 13 and 100
- **Password**: required, minimum 6 characters
- **Confirm Password**: must match Password

---

## Technologies Used

- Node.js
- Express
- EJS (Embedded JavaScript Templates)
- validator (npm package for server-side validation)
- HTML, CSS & inline JavaScript (client-side validation)
