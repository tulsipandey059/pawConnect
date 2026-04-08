# Fix Registration 409 Error - Approved Plan Execution

Status: 🔄 In Progress

## Steps from Approved Plan (Execute sequentially):

- [x] **Step 1**: Create/update this TODO_fix_registration.md with plan steps
- [x] **Step 2**: Update `frontend/src/pages/auth/RegisterPage.jsx` 
  - ✅ Enhanced 409 UX with yellow login suggestion banner (auto-hide 5s)
  - ✅ Fixed role options to backend enum
  - Phone/city fields optional (bonus later if needed)
  - Enhance 409 error UX: Show \"Account exists! Login here\" link
  - Auto-clear error after 5s
  - Fix role options to match backend enum: ['owner','ngo','volunteer','admin']
  - Add optional phone/city fields
- [x] **Step 3**: Update `backend/controllers/authController.js`
  - ✅ Friendlier error message for 409 (frontend detects it)
  - For 409 error: Return `{success: false, message: \"...\", suggestLogin: true}` 
- [x] **Step 4**: Minor update `frontend/src/services/authService.js` if needed for full error obj
  - ✅ No change needed (error.message propagates correctly)
- [ ] **Step 5**: Test
  - Backend: `cd backend && npm start`
  - Frontend: `cd frontend && npm run dev`
  - Test duplicate email → better UX
  - Test new registration → success
- [ ] **Step 6**: Verify DB (optional Mongo clean), update this TODO as complete

**Current Progress**: Steps 1-4 ✅, ready for testing (Step 5) and completion
