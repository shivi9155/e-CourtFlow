# Default Role Configuration

## Summary of Changes

This document outlines the default role configuration for the e-CourtFlow application.

### Default Authorization State

- **Default State**: No admin is logged in by default (`admin = null`)
- **Public Accessibility**: The website is fully accessible to the public without any authentication
- **Admin Features**: Only visible after successful admin login

### Key Configuration Points

#### 1. AuthContext (`src/context/AuthContext.jsx`)
- Admin state initializes to `null` on application start
- localStorage is checked for persisted admin session, but only if valid data is present
- Corrupted or incomplete admin data is automatically cleared
- Comment added: "By default, no one is logged in as admin until they explicitly log in."

#### 2. Navbar (`src/components/Navbar.jsx`)
- **When NOT logged in**: Shows "🔐 Admin Login" link
- **When logged in**: Shows "📊 Admin Dashboard" link and "🚪 Admin Logout" button (in red)
- Public navigation is always visible (Home, Cases, Search, Court, Judges, Judge Search)
- Admin section is conditionally rendered based on authentication state

#### 3. Dashboard (`src/pages/Admin/Dashboard.jsx`)
- Protected by PrivateRoute (requires valid admin login)
- Displays logged-in admin's name (e.g., "Welcome back, John Smith")
- Shows admin's role (e.g., "superadmin" or "clerk")
- Only accessible after authentication

#### 4. PrivateRoute (`src/components/PrivateRoute.jsx`)
- Protects all admin routes
- Redirects unauthenticated users to `/admin/login`
- Validates both token and role before granting access

### User Experience Flow

#### First-Time Visit
1. User visits the website
2. Website loads with no admin logged in
3. Public pages are accessible (Home, Cases, etc.)
4. Admin features are not visible in the navbar
5. "Admin Login" link is available for admin users

#### Admin User Flow
1. Admin clicks "🔐 Admin Login" in navbar
2. Admin enters credentials and logs in
3. Admin is redirected to Dashboard
4. Admin Dashboard and Admin Logout are now visible in navbar
5. Admin can access all admin features

#### Admin Logout
1. Admin clicks "🚪 Admin Logout"
2. Session is cleared from both state and localStorage
3. Admin is logged out, returns to public mode
4. "Admin Login" link reappears in navbar

### Testing & Development

#### To Clear localStorage (e.g., for testing)
Open browser console and run:
```javascript
localStorage.removeItem('admin');
```

Or use the following in your code:
```javascript
localStorage.clear(); // Clears all localStorage
```

Then refresh the page to start with a clean state.

### Security Notes

- ✅ No one is granted admin access by default
- ✅ Admin credentials are required for all admin operations
- ✅ JWT tokens are validated on each request
- ✅ Corrupted/invalid tokens are automatically cleared
- ✅ Public pages remain publicly accessible
- ✅ Admin features are behind authentication

### Routes Configuration

**Public Routes** (no authentication required):
- `/` - Home
- `/cases` - Cases List
- `/case/:id` - Case Detail
- `/search` - Search
- `/judges` - Judges List
- `/judge/:id` - Judge Profile
- `/judge-search` - Judge Search
- `/court` - Court Information
- `/admin/login` - Admin Login Page

**Protected Routes** (admin authentication required):
- `/admin` - Dashboard
- `/admin/cases` - Manage Cases
- `/admin/cases/new` - Add Case
- `/admin/judges` - Manage Judges
- `/admin/add-judge` - Add Judge
- `/admin/hearings` - Manage Hearings
- `/admin/hearings/schedule` - Schedule Hearing
- `/admin/reports` - Reports
