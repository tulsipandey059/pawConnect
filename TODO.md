# PawConnect Frontend-Backend Integration TODO

## Status: 🚀 In Progress

✅ [x] 1. Create `.env` with `VITE_API_BASE=http://localhost:5000/api` (dev server on :5174)
✅ [x] 2. Update `src/services/authService.js` - real `/auth/login/register` calls, token storage
✅ [x] 3. Update `src/services/petService.js` - `/pets` GET/POST with FormData for images
✅ [x] 4. Update `src/context/PetContext.jsx` - loads from petService.getPets(), addPet calls createPet, added loading/error
✅ [x] 5. AuthContext already compatible - uses localStorage 'currentUser'/'token' set by authService
✅ [x] 6. Update LoginPage.jsx & RegisterPage.jsx - use authService.login/register, keep event dispatch & navigate
✅ [x] 7. Pet pages updated (AddPetPage fully async, BrowsePetsPage uses new PetContext loading)
- [ ] 8. Add loading/error handling
- [ ] 9. Test: Restart vite (`npm run dev`), test login/add pet/browse
- [x] 10. Backend already running & tested ✅

**Next:** Run `npm run dev` after env changes. Check off as completed.
