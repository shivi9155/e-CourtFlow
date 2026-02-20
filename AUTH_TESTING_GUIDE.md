# E-CourtFlow Authentication Testing Guide

## Quick Start

### 1. Seed Admin Users
Run the seed script to create test admin users:

```bash
cd Backend
npm install
node seed.js
```

Expected output:
```
✅ superadmin created: superadmin@court.com / superadmin123
✅ clerk created: clerk@court.com / clerk123
```

### 2. Start Backend Server
```bash
cd Backend
npm start
```

Server should be running on `http://localhost:5000`

### 3. Start Frontend Development Server
```bash
# In root directory
npm install
npm run dev
```

Frontend should be running on `http://localhost:5173`

## Manual Testing Steps

### Test 1: Admin Login (Valid Credentials)

1. Navigate to `http://localhost:5173/admin/login`
2. Enter credentials:
   - Email: `superadmin@court.com`
   - Password: `superadmin123`
3. Click "Login"

**Expected Result**: ✅
- Should redirect to `/admin` dashboard
- Welcome message shows "Welcome Super Admin"
- Dashboard displays statistics
- localStorage should contain admin data and token

**Verify in Browser**:
```javascript
// Open DevTools Console
console.log(JSON.parse(localStorage.getItem('admin')))
// Should show: { _id: "...", name: "Super Admin", email: "superadmin@court.com", role: "superadmin", token: "eyJ..." }
```

### Test 2: Admin Login (Invalid Credentials)

1. Navigate to `http://localhost:5173/admin/login`
2. Enter credentials:
   - Email: `superadmin@court.com`
   - Password: `wrongpassword`
3. Click "Login"

**Expected Result**: ✅
- Should show toast error: "Invalid credentials"
- Should stay on login page
- Should NOT redirect to dashboard
- localStorage should be empty

### Test 3: Non-Admin User Cannot Login

1. Create a non-admin user in MongoDB directly:
```javascript
db.admins.insertOne({
  name: "Regular User",
  email: "user@example.com",
  password: "hashedpassword",
  role: "user"  // Invalid role
})
```

2. Try to login with `user@example.com`

**Expected Result**: ✅
- Should show error: "Only admin users can access the admin portal"
- Should NOT redirect to dashboard

### Test 4: Access Admin Dashboard Without Login

1. Clear localStorage: `localStorage.clear()`
2. Try to directly navigate to `http://localhost:5173/admin`

**Expected Result**: ✅
- Should redirect to `/admin/login`
- Should NOT show dashboard

### Test 5: Access Admin with Expired Token

1. Manually expire token in localStorage:
```javascript
// In Console
let admin = JSON.parse(localStorage.getItem('admin'));
admin.token = 'invalid.expired.token';
localStorage.setItem('admin', JSON.stringify(admin));
```

2. Try to access `/admin/cases`

**Expected Result**: ✅
- Should show error notification
- Should redirect to login page
- localStorage should be cleared

### Test 6: Create New Case (Admin Operation)

1. Login as superadmin
2. Navigate to `/admin/cases`
3. Click "New Case"
4. Fill form:
   - Case Number: `CASE-001`
   - Title: `Test Case`
   - Petitioner: `John Doe`
   - Respondent: `Jane Smith`
   - Status: `pending`
5. Click "Submit"

**Expected Result**: ✅
- Should show success toast: "Case created"
- Case should appear in table
- API should receive Authorization header with token
- Case should be created in MongoDB

**Verify in Console**:
```javascript
// Check Authorization header in Network tab
Headers: Authorization: Bearer eyJ...
```

### Test 7: Delete Case (Admin Operation)

1. Click delete button next to a case
2. Confirm deletion

**Expected Result**: ✅
- Should show success toast: "Deleted"
- Case should be removed from table
- Should make DELETE request with auth token

### Test 8: Unauthorized Access to Admin API

1. Open console and clear token:
```javascript
localStorage.removeItem('admin');
```

2. Try to fetch admin data:
```javascript
// In Console
fetch('http://localhost:5000/api/admin/cases').then(r => r.json()).then(console.log)
```

**Expected Result**: ✅
- Should return 401 error:
```json
{
  "success": false,
  "message": "Not authorized to access this route. Please provide a token."
}
```

### Test 9: Public User Can View Cases (No Auth Required)

1. Clear localStorage: `localStorage.clear()`
2. Navigate to `http://localhost:5173/cases`

**Expected Result**: ✅
- Should show all cases without login
- Should use public endpoint: `/api/public/cases`
- No auth token required
- Read-only access (no edit/delete buttons)

### Test 10: Public User Cannot Access Admin Panel

1. Clear localStorage
2. Try to navigate to `http://localhost:5173/admin/cases`

**Expected Result**: ✅
- Should redirect to login page
- Cannot access admin features without token

## API Testing with cURL

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@court.com",
    "password": "superadmin123"
  }'
```

**Expected Response**:
```json
{
  "_id": "...",
  "name": "Super Admin",
  "email": "superadmin@court.com",
  "role": "superadmin",
  "token": "eyJ..."
}
```

### Test Get Cases (Protected)
```bash
# Replace TOKEN with actual token from login
curl -X GET http://localhost:5000/api/admin/cases \
  -H "Authorization: Bearer TOKEN"
```

**Expected Response**:
```json
[
  {
    "_id": "...",
    "caseNumber": "CASE-001",
    ...
  }
]
```

### Test Without Token
```bash
curl -X GET http://localhost:5000/api/admin/cases
```

**Expected Response**:
```json
{
  "success": false,
  "message": "Not authorized to access this route. Please provide a token."
}
```

## Browser DevTools Network Testing

1. Open DevTools (F12)
2. Click "Network" tab
3. Login to admin panel
4. Perform an action (create/update/delete case)
5. Check request headers:

**Expected Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Expected Response**:
```
Status: 200 OK
Body: { success: true, message: "..." }
```

## Common Test Cases

| Test | Input | Expected | Status |
|------|-------|----------|--------|
| Valid login | superadmin@court.com / superadmin123 | Redirect to dashboard | ✅ |
| Invalid password | superadmin@court.com / wrong | Show error | ✅ |
| Non-admin user | user@example.com / password | Access denied | ✅ |
| No token in request | - | 401 Unauthorized | ✅ |
| Expired token | (invalid token) | 401 Token failed | ✅ |
| Create case logged in | Case data | Case created | ✅ |
| Create case not logged in | Case data | 401 Unauthorized | ✅ |
| View public cases | - | Cases returned | ✅ |
| Access admin without login | - | Redirect to login | ✅ |

## Debugging Tips

### Check Backend Logs
```bash
# Terminal running backend
npm start
# Watch for authentication logs
```

### Check Frontend Console
```javascript
// DevTools Console
console.log('Admin:', JSON.parse(localStorage.getItem('admin')))
console.log('Token:', JSON.parse(localStorage.getItem('admin'))?.token)
```

### Check Network Requests
1. DevTools → Network tab
2. Look for API request
3. Check:
   - Request headers (Authorization)
   - Response status (200/401/403)
   - Response body (error message)

### MongoDB Verification
```bash
# Terminal
mongosh
use e-CourtFlow
db.admins.find()
```

### Environment Variables
Check `.env` files are correct:
```bash
# Backend/.env
PORT=5000
MONGO_URI=mongodb://localhost:27017/e-CourtFlow
JWT_SECRET=Shivani

# Root .env (if exists)
VITE_API_URL=http://localhost:5000/api
```

## Troubleshooting Checklist

- [ ] Backend server running on port 5000?
- [ ] Frontend dev server running?
- [ ] MongoDB running locally?
- [ ] Admin users seeded with `node seed.js`?
- [ ] JWT_SECRET in .env matches?
- [ ] No CORS errors in console?
- [ ] localStorage not cleared unexpectedly?
- [ ] Token format correct: `Bearer <token>`?

## Success Criteria

All tests pass when:
1. ✅ Admin can login with valid credentials
2. ✅ Admin cannot login with invalid credentials
3. ✅ Non-admin users cannot login
4. ✅ Protected routes require authentication
5. ✅ Protected routes require correct role
6. ✅ Public routes accessible without auth
7. ✅ Admin can perform CRUD operations
8. ✅ Public users can only read data
9. ✅ Token properly included in requests
10. ✅ Logout clears authentication
