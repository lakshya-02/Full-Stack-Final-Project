# Corporate Helpdesk Ticketing System

A full-stack helpdesk application for internal teams. Employees can create and track support tickets, while admins can review the full queue, update ticket status, and keep issue resolution organized.

## Required Stack

This project is aligned to the required stack only:

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT

Note: the backend now requires a real MongoDB connection. There is no in-memory fallback.

## Features

- User signup and login
- JWT-protected backend routes
- Employee and admin role support
- Create, edit, view, and delete tickets
- Admin status management for all tickets
- Search and filter by status, priority, category, and text
- Dashboard stats and ticket detail page
- Responsive React UI

## Project Structure

```text
.
|-- backend
|   |-- .env.example
|   |-- server.js
|   `-- src
|       |-- app.js
|       |-- config
|       |-- controllers
|       |-- middleware
|       |-- models
|       |-- routes
|       |-- server.js
|       `-- utils
|-- frontend
|   |-- index.html
|   `-- src
|       |-- components
|       |-- context
|       |-- pages
|       |-- routes
|       |-- services
|       `-- utils
|-- package.json
`-- readme.md
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB running locally or a MongoDB connection string

## Setup

1. Install all dependencies:

```bash
npm run install:all
```

2. Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/helpdesk
JWT_SECRET=replace_with_a_secure_secret
CLIENT_URL=http://localhost:5173
```

3. Optional frontend environment file in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the backend:

```bash
npm run dev:backend
```

5. Start the frontend:

```bash
npm run dev:frontend
```

6. Open the app in your browser:

```text
http://localhost:5173
```

## Available Scripts

At the project root:

```bash
npm run install:all
npm run dev:backend
npm run dev:frontend
npm run build
```

Inside `backend`:

```bash
npm run dev
npm run start
```

Inside `frontend`:

```bash
npm run dev
npm run build
npm run preview
```

## MongoDB Notes

- Make sure MongoDB is running before starting the backend.
- The backend will stop with an error if `MONGODB_URI` or `JWT_SECRET` is missing.
- Default local database name used in the examples: `helpdesk`

## Check MongoDB Data

Use `mongosh` to inspect the project data:

```bash
mongosh "mongodb://127.0.0.1:27017/helpdesk"
```

Useful commands inside `mongosh`:

```js
show dbs
use helpdesk
show collections
db.users.find({}, { name: 1, email: 1, role: 1 })
db.tickets.find({}, { title: 1, status: 1, priority: 1, category: 1 })
db.users.countDocuments()
db.tickets.countDocuments()
```

## Demo Roles

- New signups are created as `employee`.
- To test the admin flow, update a user directly in MongoDB:

```js
db.users.updateOne(
  { email: "admin@company.com" },
  { $set: { role: "admin" } }
)
```

## Main API Routes

```text
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me
GET    /api/tickets
POST   /api/tickets
GET    /api/tickets/:id
PUT    /api/tickets/:id
DELETE /api/tickets/:id
GET    /api/health
```

## Verification

The current project has been checked with:

- Frontend production build via `npm run build --prefix frontend`
- Backend runtime smoke test for health, signup, login, and ticket flows

## Troubleshooting

- If the backend fails at startup, confirm MongoDB is running and `backend/.env` is present.
- If requests fail from the frontend, check `CLIENT_URL` in the backend and `VITE_API_URL` in the frontend.
- If admin access is not visible, confirm the user document in MongoDB has `"role": "admin"`.
