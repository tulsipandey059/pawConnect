# TODO: AddPetPage - Find Similar Pets Feature

**Information Gathered:**
- Image upload div mb-8 (after Status Selection)
- PetCard props: pet object (image, name, location, etc)
- pets.js has mock data

**Plan:**
1. Add useState showSimilar
2. Mock 3 similar pets (use petsData.slice(0,3), add similarity)
3. Button after image upload: "Find Similar Pets" → setShowSimilar(true)
4. Conditional section: "Similar Pets Found" grid-md:3 PetCard + similarity % badge

**Progress:**
✅ Step 1: Create TODO  
✅ Step 2: Edit AddPetPage.jsx - state, handleFindSimilar, button (after image upload), similarPets mock array, results section w/ PetCard grid + similarity badges  

**Steps:**
- [ ] Step 3: Test /add-pet → upload image → "Find Similar Pets" → blue section w/ 3 cards + % overlays
- [ ] Step 4: Complete

**Status:** Feature added, test ready.


