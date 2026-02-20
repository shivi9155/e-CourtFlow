# E-CourtFlow Authentication & Authorization Guide

## Overview

This document describes the authentication and role-based access control (RBAC) system implemented in the e-CourtFlow application.

## Architecture

### Authentication Flow

```
User Login
    ↓
POST /api/auth/login (email, password)
    ↓
Backend validates credentials
    ↓
Backend checks user has admin role
    ↓
Generate JWT token (valid for 30 days)
    ↓
Return token to frontend
    ↓
Frontend stores token in localStorage
    ↓
Frontend attaches token to all subsequent requests
    ↓
Access granted to admin panel
```

### Authorization Flow

```
Request to protected endpoint
    ↓
Check Authorization header for Bearer token
    ↓
Verify JWT signature
    ↓
Check if token is expired
    ↓
Fetch admin user from database
    ↓
Check if user has required role
    ↓
Grant/deny access to resource
```

## User Roles

### 1. **Superadmin** (Full Access)
- **Role Value**: `superadmin`
- **Permissions**:
  - Add, update, delete cases
  - Add, update, delete judges
  - Create, update, delete hearing schedules
  - View all statistics and reports
  - Full system management

### 2. **Clerk** (Limited Access)
- **Role Value**: `clerk`
- **Permissions**:
  - Same as superadmin (currently configured as full access)
  - Can be customized for read-only or limited modifications

### 3. **Public Users** (Read-Only)
- **No Authentication Required**
- **Permissions**:
  - Search and view cases
  - View judge profiles
  - View hearing schedules
  - View statistics
  - **Cannot**: Add, edit, or delete any data

## API Endpoints

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "superadmin@court.com",
  "password": "superadmin123"
}

Response (200 OK):
{
  "_id": "user_id",
  "name": "Super Admin",
  "email": "superadmin@court.com",
  "role": "superadmin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Register (Creates new admin user)
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "New Admin",
  "email": "newadmin@court.com",
  "password": "secure_password",
  "role": "superadmin"
}
```

#### Dashboard (Protected)
```http
GET /api/auth/dashboard
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "message": "Welcome Super Admin",
  "admin": {
    "id": "user_id",
    "name": "Super Admin",
    "email": "superadmin@court.com",
    "role": "superadmin"
  }
}
```

#### Verify Token (Protected)
```http
GET /api/auth/verify
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "message": "Token is valid",
  "admin": { ... }
}
```

### Admin Endpoints (All Protected with Superadmin Role)

#### Cases Management
```http
# Get all cases
GET /api/admin/cases
Authorization: Bearer <token>

# Create case
POST /api/admin/cases
Authorization: Bearer <token>
Content-Type: application/json

# Update case
PUT /api/admin/cases/:id
Authorization: Bearer <token>
Content-Type: application/json

# Delete case
DELETE /api/admin/cases/:id
Authorization: Bearer <token>
```

#### Judges Management
```http
# Get all judges
GET /api/admin/judges
Authorization: Bearer <token>

# Create judge
POST /api/admin/judges
Authorization: Bearer <token>

# Update judge
PUT /api/admin/judges/:id
Authorization: Bearer <token>

# Delete judge
DELETE /api/admin/judges/:id
Authorization: Bearer <token>
```

#### Hearings Management
```http
# Get all hearings
GET /api/admin/hearings
Authorization: Bearer <token>

# Create hearing
POST /api/admin/hearings
Authorization: Bearer <token>

# Update hearing
PUT /api/admin/hearings/:id
Authorization: Bearer <token>

# Delete hearing
DELETE /api/admin/hearings/:id
Authorization: Bearer <token>
```

### Public Endpoints (No Authentication Required)

#### Search Cases
```http
GET /api/public/cases/search?q=<query>
```

#### View Cases
```http
GET /api/public/cases
GET /api/public/cases/:id
```

#### View Judges
```http
GET /api/public/judges
GET /api/public/judges/:id
GET /api/public/judges/search/<name>
```

#### View Hearings
```http
GET /api/public/hearings
GET /api/public/hearings/judge/<judgeId>
```

#### Statistics
```http
GET /api/public/stats/cases
GET /api/public/stats/judges
GET /api/public/stats/hearings
```

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route. Please provide a token."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. This action requires one of the following roles: superadmin"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

## Token Management

### JWT Token Structure
```
Header: { "alg": "HS256", "typ": "JWT" }
Payload: { "id": "<admin_id>" }
Signature: HMACSHA256(header + "." + payload, JWT_SECRET)
```

### Token Expiration
- **Validity**: 30 days
- **Refresh**: User must login again after expiration
- **Storage**: Stored in browser localStorage in production auth context

### Creating a Token
```javascript
const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
```

## Frontend Implementation

### AuthContext Usage
```jsx
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { admin, login, logout, isAdmin, isSuperAdmin } = useAuth();
  
  // Check if user is authenticated
  if (isAdmin()) {
    // User is an authenticated admin
  }
  
  // Check if user is superadmin
  if (isSuperAdmin()) {
    // User has superadmin privileges
  }
}
```

### Protected Routes
```jsx
import PrivateRoute from './components/PrivateRoute';

<Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
```

### API Request Interceptor
```javascript
// Token is automatically attached by axios interceptor
API.interceptors.request.use((config) => {
  const admin = JSON.parse(localStorage.getItem('admin'));
  if (admin?.token) {
    config.headers.Authorization = `Bearer ${admin.token}`;
  }
  return config;
});
```

## Security Best Practices

### 1. **Token Storage**
- Tokens stored in localStorage for persistence
- Cleared on logout
- Cleared on 401/403 responses

### 2. **Password Security**
- Passwords hashed using bcrypt (10 salt rounds)
- Never sent back in API responses
- Marked as `-password` in queries

### 3. **Request Validation**
- All endpoints validate required fields
- All admin routes check authentication first
- All write operations require role-based authorization

### 4. **Role Enforcement**
- All admin endpoints require `protect` middleware
- Sensitive operations require specific roles
- Roles stored in database, not in JWT

### 5. **Error Handling**
- Detailed error messages for debugging
- Generic messages for security-sensitive endpoints
- Requests logged for audit trail

## Testing & Credentials

### Run Seed Data
```bash
cd Backend
node seed.js
```

### Test Credentials

**SuperAdmin:**
```
Email: superadmin@court.com
Password: superadmin123
Role: superadmin
Access: Full system access
```

**Clerk:**
```
Email: clerk@court.com
Password: clerk123
Role: clerk
Access: Full system access (can be customized)
```

### Test Login Flow
1. Navigate to `http://localhost:3000/admin/login`
2. Enter superadmin@court.com and superadmin123
3. Should redirect to dashboard
4. Token should be stored in localStorage
5. Should be able to manage cases, judges, and hearings

### Test Unauthorized Access
1. Try accessing `/admin/cases` without logging in
2. Should redirect to login page
3. Try accessing with invalid token
4. Should show error message

## Database Schema

### Admin Model
```javascript
{
  name: String,          // Admin user's full name
  email: String,         // Unique email address
  password: String,      // Hashed password
  role: String,          // 'superadmin' or 'clerk'
  createdAt: Date        // Account creation timestamp
}
```

## Environment Variables

Backend `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/e-CourtFlow
JWT_SECRET=Shivani
```

Frontend `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

## Middleware Stack

### Protection Middleware
```
Request
  ↓
authMiddleware.protect (Verify JWT)
  ↓
authMiddleware.authorize (Check role)
  ↓
Route Handler
```

## Troubleshooting

### "Invalid credentials" on login
- Check email and password are correct
- Ensure user exists in database
- Verify user has admin role (superadmin/clerk)

### "Token failed" error
- Token may have expired (30 days)
- Try logging in again
- Check JWT_SECRET in .env matches backend

### "Access denied" (403 error)
- User role may not have required permissions
- For admin operations, ensure user is 'superadmin'
- Check user role in MongoDB

### Token not persisting
- Check localStorage is enabled in browser
- Check browser console for errors
- Verify AuthContext provider wraps app

### CORS errors on API requests
- Ensure backend CORS is configured
- Check baseURL in api.js matches backend URL
- Verify Backend is running on port 5000

## Future Enhancements

1. **Role-Based Features**
   - Add more granular roles (Clerk, Auditor, etc.)
   - Implement resource-level permissions
   - Add role management dashboard

2. **Security Enhancements**
   - Implement refresh tokens
   - Add 2-factor authentication
   - Add login attempt throttling
   - Add audit logging

3. **User Management**
   - Add user profile management
   - Implement password change
   - Add password reset functionality
   - User activity tracking

4. **Token Management**
   - Implement token refresh endpoint
   - Add token blacklist for logout
   - Implement sliding window expiration

## Support

For issues or questions about authentication:
1. Check this guide for solutions
2. Review error messages in console
3. Check backend logs in terminal
4. Verify .env variables are set correctly
