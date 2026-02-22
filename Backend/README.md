# e-CourtFlow — Backend

This README documents the backend services for the e-CourtFlow project.

## Overview

The backend is a Node.js + Express API that handles authentication, case management, judge profiles, hearings scheduling, and reporting. It exposes REST endpoints consumed by the React frontend and uses MongoDB for persistence.

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or hosted) with a connection string

## Quick setup

1. Open a terminal and change to the backend folder:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with at least the following variables:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

4. Seed sample data (optional):

```bash
node seed.js
```

## Run (development / production)

- Start (production / plain node):

```bash
npm run start
# or
node server.js
```

- Use `nodemon` for development (installed as a devDependency):

```bash
npx nodemon server.js
```

Note: `Backend/package.json` includes a `start` script that runs `node server.js`.

## Important files & folders

- `server.js` — App entry, Express setup, route mounting.
- `config/db.js` — MongoDB connection helper.
- `controllers/` — Request handlers for auth, cases, hearings, judges.
- `models/` — Mongoose schemas: `Case`, `Judge`, `Hearing`, `Court`, `Admin`.
- `routes/` — API route definitions (`authRoutes.js`, `caseRoutes.js`, `hearingRoutes.js`, etc.).
- `middleware/` — `authMiddleware.js`, validation middleware.
- `seed.js` — Script to populate sample data.

## API & Authentication

- Auth: JWT-based; middleware at `Backend/middleware/authMiddleware.js` protects admin endpoints.
- Typical endpoints (examples):
  - `POST /api/auth/login` — Admin login
  - `GET /api/cases` — List/search cases
  - `GET /api/cases/:id` — Case detail
  - `POST /api/hearings` — Schedule hearing (admin)

(See `Backend/routes/` for full route list.)

## Environment & Deployment notes

- Use environment variables for secrets and DB connections.
- For production, run behind a process manager (PM2) or containerize with Docker.
- Ensure `JWT_SECRET` and DB credentials are stored securely.

## Troubleshooting

- MongoDB connection issues: verify `MONGO_URI` and network access.
- Port conflicts: change `PORT` in `.env`.

## Contributing

Follow the code conventions in the repo. Add tests for new logic where appropriate and open PRs against the main branch.

---
