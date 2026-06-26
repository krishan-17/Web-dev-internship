# Registration Form App

A simple user registration web application built with **Node.js**, **Express**, **EJS**, and **Tailwind CSS**. It supports server-side form validation and displays all registered users in a clean table view.


## Project Structure

```
├── server.js        # Express server & route logic
├── public/
│   └── style.css    # Custom CSS (animations, transitions)
└── views/
    ├── index.ejs    # Home page with registration form
    └── users.ejs    # Registered users table
```



## Features

- **User Registration** — Collect username, email, age, and password via a form
- **Old Input Retention** — On validation failure, previously entered values are repopulated in the form
- **Success Feedback** — A success banner is shown after a successful registration
- **Users Table** — View all session-registered users at `/users`
- **Responsive Design** — Mobile-friendly layout using Tailwind CSS utility classes
- **Smooth UI** — Hover animations and focus effects via custom CSS



## Pages & Routes

| Method | Route    | Description                                      |
|--------|----------|--------------------------------------------------|
| GET    | `/`      | Renders the home page with the registration form |
| POST   | `/`      | Handles form submission and validation           |
| GET    | `/users` | Displays all users registered in the session     |

---

## Validation Rules

| Field            | Rule                                          |
|------------------|-----------------------------------------------|
| Username         | Required, minimum 3 characters                |
| Email            | Required, must be a valid email format        |
| Age              | Required, must be an integer between 13–100   |
| Password         | Required, minimum 6 characters                |
| Confirm Password | Must match the password field                 |


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
