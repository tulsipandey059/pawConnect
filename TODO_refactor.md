# Project Refactor to Scalable Architecture

**Approved:** Full restructure.

**Current files (28 total):**
components (9): AIAssistant, CategoryFilter, Footer, HeroSection, InfoCard, Navbar, PetCard
pages (11): AboutUsPage, AddPetPage, BreedDetectionPage, BrowsePage, CallPage, ChatPage, HomePage, PetDetailsPage, PetHealthPage, ReportSightingPage, SignInPage
other: App.jsx, main.jsx, index.css, data/pets.js, context/PetContext.jsx, TODO*.md

**Mapping Plan:**
**components/layout/**: Navbar.jsx, Footer.jsx
**components/pets/**: PetCard.jsx
**components/search/**: CategoryFilter.jsx
**components/chatbot/**: AIAssistant.jsx
**components/ui/**: InfoCard.jsx → Card.jsx, HeroSection.jsx → Hero.jsx
**pages/home/**: HomePage.jsx
**pages/auth/**: SignInPage.jsx → LoginPage.jsx (stub RegisterPage.jsx)
**pages/pets/**: BrowsePage.jsx → BrowsePetsPage.jsx, PetDetailsPage.jsx, AddPetPage.jsx
**pages/ai/**: PetHealthPage.jsx → DiseasePredictionPage.jsx, BreedDetectionPage.jsx, stub AIChatPage.jsx
**pages/info/**: AboutUsPage.jsx → AboutPage.jsx, stub ContactPage.jsx
**pages/reports/**: ReportSightingPage.jsx → ReportLostPetPage.jsx, stub ReportFoundPetPage.jsx
**pages/other/**: CallPage.jsx, ChatPage.jsx stay or map
data/pets.js stay
context/PetContext.jsx stay, stub AuthContext, NotificationContext
services/ 4 stubs
utils/ 3 stubs
routes/AppRoutes.jsx

**Step 1:** Create all new directories/files stubs (30+ create_file parallel).
**Step 2:** Move content (create new paths w/ old content).
**Step 3:** Update imports (App.jsx first).
**Step 4:** npm run dev test.

Proceed Step 1?

