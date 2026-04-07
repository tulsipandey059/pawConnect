Error: querySrv ECONNREFUSED _mongodb._tcp.cluster0.wjsk1f2.mongodb.net# Fix Google Auth CORS/SOP Error

## Steps:
- [ ] 1. Update backend/server.js CORS origins to include 5173
- [x] 2. Refactor frontend api.js to use VITE_API_URL
- [x] 3. Update auth pages Login/Register to dynamic Google URL
- [x] 4. Create .env with FRONTEND_URL and VITE_API_URL
- [ ] 5. Update authController googleCallback redirect to frontend + token
- [ ] 6. Test flow: login -> Google -> dashboard
- [ ] 7. Restart backend/frontend
- [ ] 8. Complete

Current: Starting step 1

