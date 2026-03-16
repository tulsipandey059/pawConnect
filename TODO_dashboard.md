# PawConnect Dashboard Implementation TODO

## Overview
Role-based dashboard after login. Single `/dashboard` route → conditional render by role.

**Roles**: petOwner, volunteer, ngo (register); admin (manual).

## Steps (to complete):

### 1. Create AuthContext [✅]
- src/context/AuthContext.jsx: user state, login/logout, localStorage.

### 2. Create ProtectedRoute [✅]
- src/components/layout/ProtectedRoute.jsx: Guard for auth.

### 3. Create mockData [✅]
- src/utils/mockData.js: notifications, requests, etc.

### 4. Create Dashboard pages [✅]
- src/pages/dashboard/Dashboard.jsx (controller)
- UserDashboard.jsx, VolunteerDashboard.jsx, NGODashboard.jsx, AdminDashboard.jsx

### 5. Update App.jsx [✅]
- Add AuthProvider, /dashboard route w/ ProtectedRoute.

### 6. Update Navbar.jsx [ ]
- Auth-aware UI.

### 7. Update auth pages [ ]
- Login/Register → /dashboard.

### 8. Update roles in RegisterPage.jsx [ ]
- petOwner/volunteer/ngo.

### 9. Enhance PetContext/data [ ]
- Mock ownerId.

### 10. Test & Admin setup [ ]
- Manual admin localStorage.
- Full flow test.

## Progress\n✅ Step 1: AuthContext\n✅ Step 3: mockData

*Run `npm run dev` after each major step.*

