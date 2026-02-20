# E-CourtFlow Authentication Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        E-COURTFLOW APPLICATION                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────┐          ┌──────────────────────────┐ │
│  │      FRONTEND (React)        │          │    BACKEND (Node.js)     │ │
│  │   http://localhost:5173      │          │  http://localhost:5000   │ │
│  ├──────────────────────────────┤          ├──────────────────────────┤ │
│  │                              │          │                          │ │
│  │  Components:                 │          │  Routes:                 │ │
│  │  ├─ Login Page              │          │  ├─ /api/auth/*         │ │
│  │  ├─ Dashboard               │          │  ├─ /api/admin/*        │ │
│  │  ├─ Admin Cases             │          │  └─ /api/public/*       │ │
│  │  ├─ Admin Judges            │          │                          │ │
│  │  └─ PrivateRoute            │          │  Middleware:             │ │
│  │                              │          │  ├─ protect (JWT verify)│ │
│  │  Context:                   │          │  └─ authorize (role)    │ │
│  │  ├─ AuthContext             │          │                          │ │
│  │  │  ├─ admin (state)        │          │  Controllers:            │ │
│  │  │  ├─ token (localStorage) │          │  ├─ authController      │ │
│  │  │  ├─ login()              │          │  ├─ caseController      │ │
│  │  │  ├─ logout()             │          │  ├─ judgeController     │ │
│  │  │  ├─ isAdmin()            │          │  └─ hearingController   │ │
│  │  │  └─ isSuperAdmin()       │          │                          │ │
│  │  └─ ThemeContext            │          │  Models:                 │ │
│  │                              │          │  ├─ Admin               │ │
│  │  Services:                  │          │  ├─ Case                │ │
│  │  └─ api.js                  │          │  ├─ Judge               │ │
│  │     ├─ Axios instance       │          │  └─ Hearing             │ │
│  │     ├─ Token interceptor    │          │                          │ │
│  │     ├─ Public endpoints     │          │  Database:               │ │
│  │     └─ Admin endpoints      │          │  └─ MongoDB             │ │
│  │                              │          │                          │
│  └──────────────────────────────┘          └──────────────────────────┘
│         │                                            │                   │
│         └────────────────────────────────────────────┘                   │
│                    HTTP/HTTPS Communication                              │
│                 (JWT Token in Authorization Header)                      │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        LOGIN SEQUENCE                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Frontend                          Backend                               │
│     │                                 │                                  │
│     │  1. User enters email/password  │                                  │
│     │─────────────────────────────────→                                  │
│     │     POST /api/auth/login        │                                  │
│     │                                 │                                  │
│     │                  2. Validate email exists                          │
│     │                  3. Check password hash                            │
│     │                  4. Check user role is admin                       │
│     │                  5. Generate JWT token                             │
│     │                                 │                                  │
│     │     Return token + user data    │                                  │
│     │←─────────────────────────────────                                  │
│     │                                 │                                  │
│     │  6. Store token in localStorage │                                  │
│     │  7. Store admin data            │                                  │
│     │  8. Redirect to /admin          │                                  │
│     │                                 │                                  │
│     │  9. User logged in ✓            │                                  │
│     │                                 │                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

## Protected Request Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PROTECTED API REQUEST                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Frontend                          Backend                               │
│     │                                 │                                  │
│     │  1. Request /api/admin/cases    │                                  │
│     │     + Authorization: Bearer ... │                                  │
│     │─────────────────────────────────→                                  │
│     │                                 │                                  │
│     │              2. Extract token from header                          │
│     │              3. Verify JWT signature                               │
│     │              4. Check token not expired                            │
│     │              5. Get admin from database                            │
│     │              6. Verify admin exists                                │
│     │              7. Check admin role                                   │
│     │                                 │                                  │
│     │              ┌─ If token invalid → 401 Unauthorized                │
│     │              ├─ If role wrong    → 403 Forbidden                   │
│     │              └─ If valid         → Process request                 │
│     │                                 │                                  │
│     │     Return cases                │                                  │
│     │←─────────────────────────────────                                  │
│     │                                 │                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

## Public Request Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      PUBLIC API REQUEST                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Frontend                          Backend                               │
│     │                                 │                                  │
│     │  1. Request /api/public/cases   │                                  │
│     │     (No token required)          │                                  │
│     │─────────────────────────────────→                                  │
│     │                                 │                                  │
│     │              2. No auth check    │                                  │
│     │              3. No role check    │                                  │
│     │              4. Return public    │                                  │
│     │                 data             │                                  │
│     │                                 │                                  │
│     │     Return public cases         │                                  │
│     │←─────────────────────────────────                                  │
│     │                                 │                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

## Request Middleware Stack

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       MIDDLEWARE STACK                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Incoming Request                                                         │
│         │                                                                 │
│         ↓                                                                 │
│  ┌─────────────────────────────────────────────────────────┐             │
│  │  CORS Middleware                                        │             │
│  │  ✓ Allow cross-origin requests from frontend            │             │
│  └─────────────────────────────────────────────────────────┘             │
│         │                                                                 │
│         ↓                                                                 │
│  ┌─────────────────────────────────────────────────────────┐             │
│  │  Body Parser Middleware                                 │             │
│  │  ✓ Parse JSON request body                              │             │
│  └─────────────────────────────────────────────────────────┘             │
│         │                                                                 │
│         ↓                                                                 │
│  ┌─────────────────────────────────────────────────────────┐             │
│  │  Route Handler                                          │             │
│  │                                                          │             │
│  │  Is this a PUBLIC route?  ─→ Process & Return ✓         │             │
│  │         │                                                │             │
│  │         No                                               │             │
│  │         ↓                                                │             │
│  │  ┌──────────────────────────────────────────────────┐   │             │
│  │  │  PROTECT Middleware                             │   │             │
│  │  │  • Extract token from Authorization header      │   │             │
│  │  │  • Verify JWT signature                         │   │             │
│  │  │  • Check token expiration                       │   │             │
│  │  │  • Load admin from database                     │   │             │
│  │  │  • Attach to req.admin                          │   │             │
│  │  │                                                  │   │             │
│  │  │  If failed → 401 Unauthorized                   │   │             │
│  │  └──────────────────────────────────────────────────┘   │             │
│  │         │                                                │             │
│  │         ↓ (Token valid, admin loaded)                    │             │
│  │  ┌──────────────────────────────────────────────────┐   │             │
│  │  │  AUTHORIZE Middleware                           │   │             │
│  │  │  • Check req.admin.role                         │   │             │
│  │  │  • Compare with allowedRoles                    │   │             │
│  │  │                                                  │   │             │
│  │  │  If role mismatch → 403 Forbidden               │   │             │
│  │  └──────────────────────────────────────────────────┘   │             │
│  │         │                                                │             │
│  │         ↓ (Role valid)                                   │             │
│  │  ┌──────────────────────────────────────────────────┐   │             │
│  │  │  ROUTE HANDLER                                  │   │             │
│  │  │  ✓ Process request with admin context           │   │             │
│  │  │  ✓ Return response                              │   │             │
│  │  └──────────────────────────────────────────────────┘   │             │
│  │                                                          │             │
│  └─────────────────────────────────────────────────────────┘             │
│         │                                                                 │
│         ↓                                                                 │
│  Response to Client                                                       │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

## Token Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        JWT TOKEN STRUCTURE                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Token Format: <Header>.<Payload>.<Signature>                            │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────┐            │
│  │ HEADER (Algorithm & Type)                                │            │
│  │                                                           │            │
│  │  {                                                        │            │
│  │    "alg": "HS256",                                       │            │
│  │    "typ": "JWT"                                          │            │
│  │  }                                                        │            │
│  │                                                           │            │
│  │  Base64URL encoded                                       │            │
│  └──────────────────────────────────────────────────────────┘            │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────┐            │
│  │ PAYLOAD (Claims/Data)                                    │            │
│  │                                                           │            │
│  │  {                                                        │            │
│  │    "id": "699811a4b2eed8147647bada",  ← Admin ID         │            │
│  │    "iat": 1774165676,                 ← Issued at        │            │
│  │    "exp": 1774165676                  ← Expires at       │            │
│  │  }                                                        │            │
│  │                                                           │            │
│  │  Base64URL encoded                                       │            │
│  │  ⚠️ NOT encrypted, only encoded (don't put secrets!)      │            │
│  └──────────────────────────────────────────────────────────┘            │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────┐            │
│  │ SIGNATURE (Verification)                                 │            │
│  │                                                           │            │
│  │  HMACSHA256(                                             │            │
│  │    base64UrlEncode(header) + "." +                       │            │
│  │    base64UrlEncode(payload),                             │            │
│  │    secret                                                │            │
│  │  )                                                        │            │
│  │                                                           │            │
│  │  Secret: "Shivani" (from .env JWT_SECRET)                │            │
│  │  ⚠️ Never share your secret!                              │            │
│  └──────────────────────────────────────────────────────────┘            │
│                                                                           │
│  Storage: localStorage                                                   │
│  ┌──────────────────────────────────────────────────────────┐            │
│  │  localStorage['admin'] = {                               │            │
│  │    _id: "...",                                           │            │
│  │    name: "Super Admin",                                  │            │
│  │    email: "superadmin@court.com",                        │            │
│  │    role: "superadmin",                                   │            │
│  │    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."      │            │
│  │  }                                                        │            │
│  └──────────────────────────────────────────────────────────┘            │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

## Role-Based Access Control (RBAC)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        RBAC MATRIX                                       │
├──────────────────────┬──────────────┬──────────────┬────────────────────┤
│ Resource/Action      │ Superadmin   │ Clerk        │ Public User        │
├──────────────────────┼──────────────┼──────────────┼────────────────────┤
│ View Cases           │ ✓ (Admin)    │ ✓ (Admin)    │ ✓ (Public)         │
│ Search Cases         │ ✓ (Admin)    │ ✓ (Admin)    │ ✓ (Public)         │
│ Create Case          │ ✓            │ ✓            │ ✗                  │
│ Update Case          │ ✓            │ ✓            │ ✗                  │
│ Delete Case          │ ✓            │ ✓            │ ✗                  │
├──────────────────────┼──────────────┼──────────────┼────────────────────┤
│ View Judges          │ ✓ (Admin)    │ ✓ (Admin)    │ ✓ (Public)         │
│ Search Judges        │ ✓ (Admin)    │ ✓ (Admin)    │ ✓ (Public)         │
│ Create Judge         │ ✓            │ ✓            │ ✗                  │
│ Update Judge         │ ✓            │ ✓            │ ✗                  │
│ Delete Judge         │ ✓            │ ✓            │ ✗                  │
├──────────────────────┼──────────────┼──────────────┼────────────────────┤
│ View Hearings        │ ✓ (Admin)    │ ✓ (Admin)    │ ✓ (Public)         │
│ Create Hearing       │ ✓            │ ✓            │ ✗                  │
│ Update Hearing       │ ✓            │ ✓            │ ✗                  │
│ Delete Hearing       │ ✓            │ ✓            │ ✗                  │
├──────────────────────┼──────────────┼──────────────┼────────────────────┤
│ View Dashboard       │ ✓            │ ✓            │ ✗                  │
│ View Statistics      │ ✓            │ ✓            │ ✓ (Public stats)   │
├──────────────────────┼──────────────┼──────────────┼────────────────────┤
│ Authentication       │ Required     │ Required     │ Not required       │
│ Token needed         │ Yes          │ Yes          │ No                 │
│ Admin portal access  │ Yes          │ Yes          │ No                 │
└──────────────────────┴──────────────┴──────────────┴────────────────────┘
```

## Error Response Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      ERROR RESPONSE FLOW                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  API Request                                                              │
│         │                                                                 │
│         ↓                                                                 │
│  ┌─────────────────────────────────────┐                                 │
│  │ Parse request                       │                                 │
│  │ ✗ Invalid format?                   │                                 │
│  │   400 Bad Request                   │                                 │
│  └─────────────────────────────────────┘                                 │
│         │                                                                 │
│         ↓ (Valid format)                                                  │
│  ┌─────────────────────────────────────┐                                 │
│  │ Check authorization header          │                                 │
│  │ ✗ No token?                         │                                 │
│  │   401 Unauthorized                  │                                 │
│  └─────────────────────────────────────┘                                 │
│         │                                                                 │
│         ↓ (Token present)                                                 │
│  ┌─────────────────────────────────────┐                                 │
│  │ Verify JWT signature                │                                 │
│  │ ✗ Invalid signature?                │                                 │
│  │   401 Invalid token                 │                                 │
│  └─────────────────────────────────────┘                                 │
│         │                                                                 │
│         ↓ (Valid signature)                                               │
│  ┌─────────────────────────────────────┐                                 │
│  │ Check token expiration              │                                 │
│  │ ✗ Expired?                          │                                 │
│  │   401 Token expired                 │                                 │
│  └─────────────────────────────────────┘                                 │
│         │                                                                 │
│         ↓ (Token valid)                                                   │
│  ┌─────────────────────────────────────┐                                 │
│  │ Load admin from database            │                                 │
│  │ ✗ Not found?                        │                                 │
│  │   401 Admin not found               │                                 │
│  └─────────────────────────────────────┘                                 │
│         │                                                                 │
│         ↓ (Admin found)                                                   │
│  ┌─────────────────────────────────────┐                                 │
│  │ Check admin role                    │                                 │
│  │ ✗ Role not admin?                   │                                 │
│  │   403 Forbidden                     │                                 │
│  └─────────────────────────────────────┘                                 │
│         │                                                                 │
│         ↓ (Role valid)                                                    │
│  ┌─────────────────────────────────────┐                                 │
│  │ Process request                     │                                 │
│  │ ✓ Success                           │                                 │
│  │   200 OK                            │                                 │
│  └─────────────────────────────────────┘                                 │
│                                                                           │
│  HTTP Status Codes Used:                                                  │
│  • 200 OK         - Request successful                                    │
│  • 201 Created    - Resource created                                      │
│  • 400 Bad Request - Invalid input data                                   │
│  • 401 Unauthorized - Missing/invalid authentication                      │
│  • 403 Forbidden  - Insufficient permissions (wrong role)                 │
│  • 404 Not Found  - Resource doesn't exist                                │
│  • 500 Server Error - Unexpected server error                             │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Summary

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      COMPLETE DATA FLOW                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  USER ← → BROWSER ← → FRONTEND ← → BACKEND ← → DATABASE                 │
│                       (React)             (Node.js)      (MongoDB)       │
│                                                                           │
│  1. User types email/password                                             │
│  2. Frontend sends to Backend (/api/auth/login)                           │
│  3. Backend checks Database                                               │
│  4. Backend validates credentials                                         │
│  5. Backend checks user role                                              │
│  6. Backend generates JWT                                                 │
│  7. Backend returns token                                                 │
│  8. Frontend stores in localStorage                                       │
│  9. Frontend redirects to dashboard                                       │
│                                                                           │
│  10. User clicks "Create Case"                                            │
│  11. Frontend sends to Backend (/api/admin/cases)                         │
│  12. Frontend includes token in Authorization header                      │
│  13. Backend verifies token                                               │
│  14. Backend checks user role                                             │
│  15. Backend validates data                                               │
│  16. Backend saves to Database                                            │
│  17. Backend returns created case                                         │
│  18. Frontend updates UI                                                  │
│                                                                           │
│  19. User navigates to public page                                        │
│  20. Frontend gets public data (/api/public/cases)                        │
│  21. NO token needed                                                      │
│  22. Backend serves public data                                           │
│  23. Frontend displays data                                               │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```
