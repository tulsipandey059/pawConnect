import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import PetDetailsPage from './pages/PetDetailsPage';
import AddPetPage from './pages/AddPetPage';
import SignInPage from './pages/SignInPage';
import CallPage from './pages/CallPage';
import ChatPage from './pages/ChatPage';
import ReportSightingPage from './pages/ReportSightingPage';
import AboutUsPage from './pages/AboutUsPage';
import PetHealthPage from './pages/PetHealthPage';
import BreedDetectionPage from './pages/BreedDetectionPage';
import AIAssistant from './components/AIAssistant';
import { PetProvider } from './context/PetContext';

function App() {
  return (
    <PetProvider>
      <Router>
        <div className="min-h-screen bg-warm-beige flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/pet/:id" element={<PetDetailsPage />} />
              <Route path="/add-pet" element={<AddPetPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/call/:petId" element={<CallPage />} />
              <Route path="/chat/:petId" element={<ChatPage />} />
              <Route path="/report-sighting/:petId" element={<ReportSightingPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/health" element={<PetHealthPage />} />
              <Route path="/breed-detect" element={<BreedDetectionPage />} />
            </Routes>
          </main>
          <Footer />
          <AIAssistant />
        </div>
      </Router>
    </PetProvider>
  );
}

export default App;

