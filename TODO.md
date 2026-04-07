# PawConnect Role-Based Dashboard Implementation TODO

## Approved Plan Steps (Step-by-step execution):

### Backend Updates
- [x] 1. Update backend/models/User.js: Change role enum to ['owner', 'ngo', 'volunteer', 'admin'], default 'owner'
- [x] 2. Update backend/middleware/auth.js: Add authorizeRoles(...allowedRoles) middleware
- [x] 3. Update backend/routes/authRoutes.js: Add example role-protected route /dashboard

### Frontend Updates
- [x] 4. Create frontend/src/components/layout/Topbar.jsx: User info, notifications, logout (linter JSX warnings ignored - no logic impact)
- [x] 5. Update frontend/src/components/layout/Sidebar.jsx: Role-specific nav items (owner/ngo/volunteer)
- [x] 6. Update frontend/src/components/layout/DesktopSidebar.jsx: Sync w/ Sidebar changes
- [x] 7. Update frontend/src/components/layout/ProtectedRoute.jsx: Add allowedRoles prop support
- [x] 8. Update frontend/src/pages/dashboard/Dashboard.jsx: Implement dynamic role-based content (Owner/NGO/Volunteer sections w/ task features), integrate Topbar
- [ ] 9. Delete redundant files: UserDashboard.jsx, NGODashboard.jsx, VolunteerDashboard.jsx, AdminDashboard.jsx

### Testing & Followup
- [x] 10. Backend: Test server restart, register/login w/ roles, /me endpoint
- [ ] 11. Frontend: Test dashboard rendering per role, responsive layout
- [x] 12. Full integration test: Login as owner/ngo/volunteer → correct UI

**Progress: Ready to start Step 1**
