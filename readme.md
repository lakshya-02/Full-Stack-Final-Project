# Corporate Helpdesk Ticketing System

A simple MERN stack helpdesk application where employees can raise support tickets and admins can manage, update, and resolve them.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT

## Project Structure

```text
.
|-- backend
|   |-- server.js
|   |-- src
|   |   |-- config
|   |   |-- controllers
|   |   |-- middleware
|   |   |-- models
|   |   |-- routes
|   |   `-- utils
|-- frontend
|   `-- src
|       |-- components
|       |-- context
|       |-- pages
|       |-- routes
|       `-- services
`-- readme.md
```

## Setup

1. Install dependencies:

   ```bash
   npm run install:all
   ```

2. Create `backend/.env`:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/helpdesk
   JWT_SECRET=replace_with_a_secure_secret
   CLIENT_URL=http://localhost:5173
   ```

3. Optional frontend `.env`:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start backend:

   ```bash
   npm run dev:backend
   ```

5. Start frontend:

   ```bash
   npm run dev:frontend
   ```

6. Open the app:

   ```text
   http://localhost:5173
   ```

## Check MongoDB Data

Use `mongosh` to inspect the local MongoDB database used by this project:

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

- Employees can sign up normally.
- Admin users can be created by setting `"role": "admin"` directly in MongoDB or by updating the user document for testing.

## Core Features

- User signup and login
- JWT-protected routes
- Role-based access for employees and admins
- Create, view, update, and delete tickets
- Dedicated ticket details page for viewing and editing a ticket
- Ticket status, priority, and category management
- Dashboard with ticket statistics
- Search and filters for status, priority, and category
- Responsive React UI
