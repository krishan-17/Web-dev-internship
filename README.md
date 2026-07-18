# Task Manager — API Integration & Front-End Interaction

A simple full-stack task manager built with **Node.js**, **Express**, and **HTML/CSS/JavaScript**. It demonstrates a complete RESTful API (Create, Read, Update, Delete) on the backend, connected to a dynamic front-end that talks to it entirely through `fetch()` — no page reloads.



## Project Structure

```
├── server.js          # Express server & REST API routes (CRUD)
├── package.json
└── public/
    ├── index.html      # Front-end UI (add / filter / edit / delete tasks)
    ├── style.css        # Styling, badges, transitions
    └── script.js        # fetch() calls to the API + dynamic DOM rendering
```

## Features

- **Full CRUD REST API** — `GET`, `POST`, `PUT`, `PATCH`, `DELETE` routes on `/api/tasks`
- **Dynamic front-end** — tasks are fetched and rendered into the page with vanilla JS, no template engine on the client
- **Create** — add a task with a title, optional description, and priority (validated both client- and server-side)
- **Read** — task list loads from the API on page load; supports filtering by `all` / `pending` / `completed`
- **Update** — inline edit-in-place per task (title, description, priority), saved via `PUT`
- **Quick toggle** — checkbox marks a task complete/incomplete via a `PATCH` request
- **Delete** — remove a task with a small exit animation
- **Live stats** — total / pending / completed counts update automatically after every change
- **Server-side validation** — invalid input (e.g. empty/short title, bad priority) returns `400` with field-level error messages, shown inline in the form
- **Toast banners** — success/error feedback for every API call

## REST API Routes

| Method | Route                     | Description                                      |
|--------|---------------------------|---------------------------------------------------|
| GET    | `/api/tasks`               | Get all tasks (optional `?status=pending\|completed`) |
| GET    | `/api/tasks/:id`            | Get a single task by id                           |
| POST   | `/api/tasks`               | Create a new task                                  |
| PUT    | `/api/tasks/:id`            | Update a task's title / description / priority / completed |
| PATCH  | `/api/tasks/:id/toggle`     | Toggle a task's completed status                   |
| DELETE | `/api/tasks/:id`            | Delete a task                                       |

### Example request/response

**POST `/api/tasks`**
```json
// Request body
{ "title": "Write project report", "description": "Summary + next steps", "priority": "high" }

// Response (201 Created)
{ "success": true, "task": { "id": 4, "title": "Write project report", "description": "Summary + next steps", "priority": "high", "completed": false, "createdAt": "2026-07-18T06:18:40.674Z" } }
```

**Validation error (400 Bad Request)**
```json
{ "success": false, "errors": { "title": "Title must be at least 3 characters" } }
```

## Tech Stack

| Technology   | Purpose                                  |
|--------------|-------------------------------------------|
| Node.js      | JavaScript runtime                        |
| Express.js   | Web framework, REST routing, JSON API     |
| Tailwind CSS | Utility-first styling (via CDN)           |


## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Notes

- Tasks are stored **in-memory** (in the `tasks` array in `server.js`). All data resets when the server restarts. To persist data, integrate a database such as MongoDB or SQLite.
- The front-end keeps a local copy of the task list in memory after the initial `GET`, and re-syncs it from each API response — so every add/edit/delete/toggle updates the UI instantly without re-fetching the whole list.
- You can also test the API directly with a tool like **Postman** or `curl` using the routes above.
