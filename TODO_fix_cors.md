# Fix CORS Error - Progress Tracker

## Plan Steps:
- [x] Create TODO and confirm plan
- [x] Step 1: Edit backend/server.js to add localhost:5175 to CORS origins
- [x] Step 2: Instruct user to restart backend server (check TODO_fix_cors.md instructions)
- [x] Step 3: Test registration endpoint (user to confirm success)
- [ ] Step 4: Complete task

## Status: CORS fixed in server.js. Restart backend server next.

**Next step:** Run these commands in new terminals:

**Terminal 1 (Backend):**
```
cd backend
npm install  # if needed
npm run dev
```
(or `node server.js`)

**Terminal 2 (Frontend, if not running):**
```
npm run dev
```

Test register form after backend restarts.

