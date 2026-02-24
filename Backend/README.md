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
- `seed.js` — Script to populate sample data.

### controllers/
Request handler logic for each main resource:
  - **authController.js** — Handles admin registration and login. Validates admin roles, issues JWT tokens, and enforces @gmail.com domain for admin emails.
  - **caseController.js** — Manages case data. Supports searching, retrieving, creating, updating, and deleting cases. Handles both public and admin endpoints.
  - **hearingController.js** — Manages hearings. Allows scheduling, updating, retrieving, and listing hearings by case or judge. Handles both public and admin endpoints.
  - **judgeController.js** — Handles judge profiles. Supports listing, searching, creating, updating, and retrieving judges for both public and admin views.

### middleware/
Express middleware for authentication and validation:
  - **authMiddleware.js** — Protects routes using JWT authentication. Ensures only authenticated admins with valid roles (superadmin, clerk) can access protected endpoints. Also provides role-based authorization.
  - **validationMiddleware.js** — Validates request bodies for case creation and updates using express-validator. Returns errors if required fields are missing or invalid.

### models/
Mongoose schemas for MongoDB collections:
  - **Case.js** — Defines the structure for court cases, including parties, status, assigned judge, and hearing dates.
  - **Judge.js** — Judge profile schema, including name, contact, specialization, assigned cases, and availability.
  - **Hearing.js** — Schema for hearings, linking to cases and judges, with date, time, status, and notes.
  - **Court.js** — Court details, location, courtrooms, judges, and active cases.
  - **Admin.js** — Admin user schema with hashed password, role (superadmin/clerk), and authentication helpers.

### routes/
Express route definitions for API endpoints:
  - **authRoutes.js** — Handles admin registration, login, and dashboard access. Uses auth middleware for protection.
  - **adminRoutes.js** — All admin-only endpoints for managing cases, judges, and hearings. Protected by authentication and role-based authorization. Uses validation middleware for input checks.
  - **publicRoutes.js** — Publicly accessible endpoints for searching/viewing cases, judges, and hearings. No authentication required.

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
