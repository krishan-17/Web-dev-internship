# Registration Form App

A simple user registration web application built with **Node.js**, **Express**, **EJS**, and **Tailwind CSS**. It supports server-side and advanced live client-side form validation, hash-based client-side routing between page sections, and displays all registered users in a clean table view without page reloads.

> **Task 4 update:** added stronger validation (password strength, confirm-password matching, format checks), live/dynamic DOM feedback (progress indicator, inline error messages, valid/invalid field states, password show/hide), and hash-based client-side routing between sections (`#about`, `#services`, `#register`, `#contact`, `#users`) powered by a new `public/script.js`.

## Project Structure

```
├── server.js        # Express server, route logic & JSON API endpoints
├── public/
│   ├── style.css     # Custom CSS (animations, transitions, validation states)
│   └── script.js     # NEW - hash router, live validation, AJAX form submit
└── views/
    ├── index.ejs    # Home page: about/services/register/contact/users sections
    └── users.ejs    # Registered users table (classic, no-JS fallback page)
```



## Features

- **User Registration** — Collect username, email, age, and password via a form
- **Old Input Retention** — On validation failure (no-JS fallback), previously entered values are repopulated in the form
- **Live Client-side Validation** — Every field is checked as you type/blur, with inline error messages that appear and disappear dynamically
- **Password Strength Indicator** — A live text label (Weak → Very strong) based on length and character variety
- **Confirm Password Matching** — Instantly flags mismatched passwords, and re-checks automatically if you edit the original password
- **Show / Hide Password** — Toggle buttons (👁 / 🙈) reveal or mask both password fields
- **Hash-based Client-side Routing** — `#about`, `#services`, `#register`, `#contact`, and `#users` switch the visible section instantly, with no page reload and an active nav-link indicator
- **AJAX Registration** — The form submits via `fetch()` to a JSON API; success/error banners and the users table update live in the DOM
- **Users Table** — View all session-registered users at the `#users` route (loaded via `/api/users`), or the classic `/users` page as a no-JS fallback
- **Responsive Design** — Mobile-friendly layout using Tailwind CSS utility classes
- **Smooth UI** — Hover animations, focus effects and transition-based feedback via custom CSS



## Pages & Routes

| Method | Route           | Description                                              |
|--------|-----------------|------------------------------------------------------------|
| GET    | `/`             | Renders the home page (about/services/register/contact/users sections) |
| POST   | `/`             | Classic full-page form submission & server-side validation (no-JS fallback) |
| POST   | `/api/register` | AJAX JSON endpoint used by `script.js` to register a user without reloading |
| GET    | `/api/users`    | Returns the current session's registered users as JSON     |
| GET    | `/users`        | Classic server-rendered users table (no-JS fallback)        |

Client-side hash routes (handled entirely in the browser, no server round-trip): `#about`, `#services`, `#register`, `#contact`, `#users`.

---

## Validation Rules

| Field            | Rule                                                                 |
|------------------|-----------------------------------------------------------------------|
| Username         | Required, minimum 3 characters, letters/numbers/underscores only     |
| Email            | Required, must be a valid email format                               |
| Age              | Required, must be an integer between 13–100                          |
| Password         | Required, minimum 6 characters, must include upper case, lower case, and a digit |
| Confirm Password | Required, must match the password field                              |

All rules are enforced **live in the browser** (`public/script.js`) for instant feedback, and are **re-validated on the server** (`server.js`) as the source of truth.


## Tech Stack

| Technology   | Purpose                        |
|--------------|--------------------------------|
| Node.js      | JavaScript runtime             |
| Express.js   | Web framework and routing      |
| EJS          | Server-side HTML templating    |
| Tailwind CSS | Utility-first CSS framework    |


## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone or download the project files.

2. Install dependencies:
   ```bash
   npm install express ejs validator
   ```

3. Place the view files:
   - `index.ejs` and `users.ejs` inside a `views/` folder
   - `style.css` inside a `public/` folder

4. Start the server:
   ```bash
   node server.js
   ```

5. Open your browser and visit:
   ```
   http://localhost:3000
   ```

---

## Notes

- User data is stored **in-memory** (in the `registeredUsers` array). All data is lost when the server restarts. To persist data, integrate a database such as MongoDB or SQLite.
- Passwords are stored as plain text in this demo. In a production app, always hash passwords using a library like **bcrypt**.
