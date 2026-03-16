# PawConnect Dashboard Setup & Test

## All steps complete ✅

Dashboard implementation finished with role-based views.

## Test Instructions

### 1. Register new user
1. Go to http://localhost:5173/register
2. Fill form, select role (Pet Owner/volunteer/ngo)
3. Submit → redirects to /dashboard with role-specific view

### 2. Login existing
1. Register first if no users
2. Login → /dashboard

### 3. Test roles
| Role | Features |
|------|----------|
| **petOwner** | Profile, My Pets (mock filter), Reports, Apps, Notifications |
| **volunteer** | Rescue requests, Map, Stats |
| **ngo** | Adoption mgmt, Requests, Volunteers |
| **admin** | Stats, Users table, Moderate, Actions |

### 4. Admin access (manual)\nRun in browser console:\n```js
localStorage.setItem('currentUser', JSON.stringify({
  id: 999, 
  name: 'Admin', 
  email: 'admin@pawconnect.com', 
  role: 'admin', 
  password: 'admin123'
}));
location.href = '/dashboard';
```

### 5. Navbar/Logout
- Logged in: Avatar, role, Dashboard, Logout
- Mobile responsive

### 6. Protected
- No auth → redirects /login
- Admin only for AdminDashboard

**Run `npm run dev` and test all flows!**

