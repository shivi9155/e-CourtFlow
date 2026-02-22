# Thunder Client API Guide - E-CourtFlow

Complete guide for testing E-CourtFlow APIs using Thunder Client.

---

## Table of Contents
1. [Authentication](#authentication)
2. [Adding New Admin](#adding-new-admin)
3. [Using JWT Token](#using-jwt-token)
4. [Admin Endpoints](#admin-endpoints)
5. [Thunder Client Setup](#thunder-client-setup)

---

## Authentication

### Base URL
```
http://localhost:5000
```

### Required Setup
1. Backend must be running on port 5000
2. MongoDB must be connected
3. Environment variables configured

---

## Adding New Admin

### Step 1: Create Admin Registration Request

**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Your Admin Name",
  "email": "admin@gmail.com",
  "password": "password123",
  "role": "superadmin"
}
```

**Requirements:**
- `email` must end with `@gmail.com` (enforced by backend)
- `role` must be either `"superadmin"` or `"clerk"`
- `password` minimum 6 characters recommended
- `name` is required

**Success Response (201):**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "name": "Your Admin Name",
  "email": "admin@gmail.com",
  "role": "superadmin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTFiMmMzZDRlNWY2Zzd..."
}
```

**Error Responses:**
- `400` - Invalid email (not @gmail.com), or admin already exists
- `500` - Server error

---

## Using JWT Token

### Token Validity
- **Expiration:** 30 days from creation
- **Format:** Bearer token in Authorization header
- **Prefix:** Must include "Bearer " before token

### In Thunder Client

In **Headers** tab, add:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Example Request with Token

**Method:** `GET`  
**URL:** `http://localhost:5000/api/auth/dashboard`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response (200):**
```json
{
  "success": true,
  "message": "Welcome John Doe",
  "admin": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "admin@gmail.com",
    "role": "superadmin"
  }
}
```

### Token Error Responses
- `401 - Invalid token` - Token is malformed or invalid
- `401 - Token expired` - Token is older than 30 days
- `401 - Not authorized` - Token not provided in header

---

## Admin Endpoints

### All endpoints require:
- **Token** in Authorization header
- **Valid admin role** (superadmin or clerk)

### Cases Management (Superadmin only)

#### Get All Cases
```
GET /api/admin/cases
Headers: Authorization: Bearer <token>
```

#### Create New Case
```
POST /api/admin/cases
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "caseNumber": "CS-2024-001",
  "title": "Case Title",
  "description": "Case description",
  "status": "ongoing"
}
```

#### Update Case
```
PUT /api/admin/cases/:id
Headers: Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "status": "closed"
}
```

#### Delete Case
```
DELETE /api/admin/cases/:id
Headers: Authorization: Bearer <token>
```

#### Get Case Statistics
```
GET /api/admin/cases-stats
Headers: Authorization: Bearer <token>
```

---

### Judges Management (Superadmin only)

#### Get All Judges
```
GET /api/admin/judges
Headers: Authorization: Bearer <token>
```

#### Create New Judge
```
POST /api/admin/judges
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "name": "Judge Name",
  "email": "judge@gmail.com",
  "court": "Court Name",
  "specialization": "Criminal Law"
}
```

#### Update Judge
```
PUT /api/admin/judges/:id
Headers: Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "specialization": "Civil Law"
}
```

#### Delete Judge
```
DELETE /api/admin/judges/:id
Headers: Authorization: Bearer <token>
```

#### Get Judge Statistics
```
GET /api/admin/judges-stats
Headers: Authorization: Bearer <token>
```

---

### Hearings Management (Superadmin only)

#### Get All Hearings
```
GET /api/admin/hearings
Headers: Authorization: Bearer <token>
```

#### Schedule New Hearing
```
POST /api/admin/hearings
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "caseId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "judgeId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "hearingDate": "2024-03-15",
  "hearingTime": "10:00 AM",
  "location": "Courtroom A"
}
```

#### Update Hearing
```
PUT /api/admin/hearings/:id
Headers: Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "hearingDate": "2024-03-20"
}
```

#### Delete Hearing
```
DELETE /api/admin/hearings/:id
Headers: Authorization: Bearer <token>
```

---

### Authentication Endpoints

#### Login Admin
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "admin@gmail.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "name": "Admin Name",
  "email": "admin@gmail.com",
  "role": "superadmin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Verify Token
```
GET /api/auth/verify
Headers: Authorization: Bearer <token>
```

#### Dashboard Access
```
GET /api/auth/dashboard
Headers: Authorization: Bearer <token>
```

---

## Thunder Client Setup

### Step-by-Step Setup in Thunder Client

#### 1. Create New Request
- Click **"New"** → **"Request"**
- Give it a name (e.g., "Register Admin")

#### 2. Set Method and URL
- Method: **POST** (or appropriate HTTP method)
- URL: `http://localhost:5000/api/auth/register`

#### 3. Add Headers
Click **"Headers"** tab:
```
Content-Type: application/json
Authorization: Bearer <token_if_needed>
```

#### 4. Add Request Body
Click **"Body"** tab, select **JSON**:
```json
{
  "name": "Admin Name",
  "email": "admin@gmail.com",
  "password": "password123",
  "role": "superadmin"
}
```

#### 5. Send Request
Click **"Send"** button

#### 6. View Response
Response appears in the "Response" section below

---

## Common Workflow Examples

### Example 1: Register and Login

**Request 1 - Register:**
```
POST /api/auth/register
Body: {
  "name": "John Admin",
  "email": "john@gmail.com",
  "password": "john123",
  "role": "superadmin"
}
```

Copy the `token` from response.

**Request 2 - Login:**
```
POST /api/auth/login
Body: {
  "email": "john@gmail.com",
  "password": "john123"
}
```

---

### Example 2: Create Case with Token

**Prerequisites:** Have a valid token from login/register

```
POST /api/admin/cases
Headers:
  Authorization: Bearer <your_token_here>
  Content-Type: application/json

Body: {
  "caseNumber": "CS-2024-100",
  "title": "Smith vs. Johnson",
  "description": "Breach of contract case",
  "status": "ongoing"
}
```

---

## Troubleshooting

### "Admin email must be a @gmail.com address"
- Ensure email ends with `@gmail.com`
- Example: ❌ `admin@yahoo.com` → ✅ `admin@gmail.com`

### "Invalid token" Error
- Verify token is copied correctly (no spaces before/after)
- Check Authorization header format: `Bearer <token>`
- Not: `Bearer<token>` or `<token>` alone

### "Token expired" Error
- Token is older than 30 days
- Login again to get a new token

### "Only admin users can access this portal"
- User role must be `superadmin` or `clerk`
- Role was set to something else during registration

### 401 Unauthorized
- Token missing from Authorization header
- Server restarted (invalidates tests)
- Restart backend: `npm start` in Backend folder

### 403 Access Denied
- User role doesn't have permission for that endpoint
- Only `superadmin` can access most admin endpoints
- `clerk` has limited access

---

## Notes

- All timestamps use ISO 8601 format
- Passwords are hashed using bcrypt
- All requests require `Content-Type: application/json`
- Base URL must be `http://localhost:5000`
- Ensure backend is running before testing

---

## Quick Reference

| Action | Method | Endpoint | Auth |
|--------|--------|----------|------|
| Register Admin | POST | `/api/auth/register` | No |
| Login | POST | `/api/auth/login` | No |
| Dashboard | GET | `/api/auth/dashboard` | Yes |
| Get Cases | GET | `/api/admin/cases` | Yes |
| Create Case | POST | `/api/admin/cases` | Yes |
| Get Judges | GET | `/api/admin/judges` | Yes |
| Create Judge | POST | `/api/admin/judges` | Yes |
| Get Hearings | GET | `/api/admin/hearings` | Yes |
| Schedule Hearing | POST | `/api/admin/hearings` | Yes |

---

**Last Updated:** February 22, 2026  
**Version:** 1.0
