 # e-CourtFlow — Backend API Reference

This document describes the REST API provided by the e-CourtFlow backend. It covers public endpoints, authentication, and protected admin endpoints used by the frontend.

Base URL

- Local development default: `http://localhost:5000`
- API base paths used in this project:
  - Auth routes: `/api/auth`
  - Public read-only routes: `/api/public`
  - Admin (protected) routes: `/api/admin`

Authentication

- Authentication uses JSON Web Tokens (JWT).
- Login via `POST /api/auth/login` returns a token in the response body.
- For protected (admin) endpoints include the header:

```
Authorization: Bearer <JWT_TOKEN>
```

- Admin routes are protected by `Backend/middleware/authMiddleware.js` and role-checked via `authorize(...)`.

Content type: All endpoints expect and return JSON (`application/json`).

Common response format

- Success responses: JSON object (examples below)
- Error responses: `{ message: "error description" }` with appropriate HTTP status codes

Public Endpoints (/api/public)

1. GET /api/public/cases
- Description: Get list of public cases (paginated/filtered as implemented)
- Query examples: `?page=1&limit=20` or search via `/api/public/cases/search`
- Response: array of case objects

2. GET /api/public/cases/search
- Description: Search cases by query parameters
- Query: `?q=case+number` or other query params per implementation

3. GET /api/public/cases/:id
- Description: Get case detail by ID
- Path param: `id` (case ObjectId)

4. GET /api/public/stats/cases
- Description: Case statistics summary

Judges (public)

5. GET /api/public/judges
- Description: List judges (public view)

6. GET /api/public/judges/:id
- Description: Get judge detail by ID

7. GET /api/public/judges/search/:name
- Description: Search judges by name

8. GET /api/public/stats/judges
- Description: Judges statistics

Hearings (public)

9. GET /api/public/hearings
- Description: List public hearings

10. GET /api/public/hearings/judge/:judgeId
- Description: Get hearings for a judge

11. GET /api/public/stats/hearings
- Description: Simple hearing stats (total, upcoming)

Auth Endpoints (/api/auth)

1. POST /api/auth/register
- Description: Register a new admin user
- Body example:

```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "strongpassword",
  "role": "superadmin" // or "clerk"
}
```
- Notes: In many production setups, registration is limited or done via seeding.

2. POST /api/auth/login
- Description: Login and receive JWT token
- Body example:

```json
{
  "email": "admin@example.com",
  "password": "strongpassword"
}
```
- Success response example:

```json
{
  "success": true,
  "token": "<JWT_TOKEN>",
  "admin": { "id": "...", "name": "...", "email": "...", "role": "superadmin" }
}
```

3. GET /api/auth/dashboard
- Description: Protected example route returning admin info
- Header: `Authorization: Bearer <JWT>`

4. GET /api/auth/verify
- Description: Verify token validity and return admin info
- Header: `Authorization: Bearer <JWT>`

Admin Endpoints (/api/admin)

Note: All `/api/admin` routes are protected and require a valid JWT and the appropriate role (often `superadmin`). The routes are implemented in `Backend/routes/adminRoutes.js`.

Cases

- GET /api/admin/cases
  - Get all cases (superadmin)

- POST /api/admin/cases
  - Create new case
  - Body: case fields (see `Backend/models/Case.js`)

- PUT /api/admin/cases/:id
  - Update case by ID

- DELETE /api/admin/cases/:id
  - Delete case by ID

- GET /api/admin/cases-stats
  - Get admin-only case statistics

Judges

- GET /api/admin/judges
- POST /api/admin/judges
- PUT /api/admin/judges/:id
- DELETE /api/admin/judges/:id
- GET /api/admin/judges-stats

Hearings

- GET /api/admin/hearings
- POST /api/admin/hearings
- PUT /api/admin/hearings/:id
- DELETE /api/admin/hearings/:id

Example curl requests

- Login and capture token:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

- Use token for protected admin call:

```bash
curl -X GET http://localhost:5000/api/admin/cases \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

Request/Response examples (simplified)

- Create Case (POST /api/admin/cases)

Request body (example):

```json
{
  "caseNumber": "2026-001",
  "title": "State vs. Doe",
  "status": "Open",
  "court": "Central Court",
  "parties": ["State", "John Doe"],
  "details": "Short description"
}
```

- Typical success response:

```json
{
  "success": true,
  "data": { /* created case object */ }
}
```

Models (summary)

- `Case` — fields: caseNumber, title, status, court, parties, hearings (refs), createdAt, updatedAt
- `Judge` — name, designation, court, bio, contact, stats
- `Hearing` — case (ref), judge (ref), hearingDate, venue, notes
- `Court` — name, location, contact
- `Admin` — name, email, password (hashed), role (superadmin|clerk)

See `Backend/models/` for exact schemas.

Validation & Middleware

- `Backend/middleware/validationMiddleware.js` contains request validators (e.g., `validateCase`).
- `Backend/middleware/authMiddleware.js` handles `protect` (token verification) and `authorize(...)` role checks.

Error handling

- Endpoints return appropriate HTTP codes (400/401/403/404/500) with a JSON `{ message: "..." }`.
- Check server console for stack traces in development.

Testing & Postman

- Import endpoints into Postman or Hoppscotch using the base URL `http://localhost:5000`.
- Save the `Authorization` header as a bearer token after logging in.

Seeding data

- Run `node seed.js` from the `Backend` folder to populate sample data for demo purposes.

Deployment notes

- Use environment variables: `MONGO_URI`, `PORT`, `JWT_SECRET`.
- Consider enabling HTTPS and stricter CORS policies in production.

Contacts & References

- Server entry: `Backend/server.js`
- Route definitions: `Backend/routes/*.js`
- Controllers: `Backend/controllers/*.js`
- Models: `Backend/models/*.js`
- Middleware: `Backend/middleware/*.js`

---
