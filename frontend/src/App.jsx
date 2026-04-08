import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/home/HomePage';
import BrowsePetsPage from './pages/pets/BrowsePetsPage';
import PetDetailsPage from './pages/pets/PetDetailsPage';
import LostPetsPage from './pages/pets/LostPetsPage';
import MyPetsPage from './pages/pets/MyPetsPage';
import AddPetPage from './pages/pets/AddPetPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CallPage from './pages/call/CallPage';
import ChatPage from './pages/chat/ChatPage';
import ReportLostPetPage from './pages/reports/ReportLostPetPage';
import ReportFoundPetPage from './pages/reports/ReportFoundPetPage';
import MapPage from './pages/map/MapPage';
import AdoptionPage from './pages/adoption/AdoptionPage';
import AdoptionFormPage from './pages/adoption/AdoptionFormPage';
import AboutPage from './pages/info/AboutPage';
import DiseasePredictionPage from './pages/ai/DiseasePredictionPage';
import BreedDetectionPage from './pages/ai/BreedDetectionPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import ProfilePage from './pages/profile/ProfilePage';
import VolunteerPage from './pages/volunteer/VolunteerPage';
import ContactPage from './pages/info/ContactPage';
import AIChatPage from './pages/ai/AIChatPage';
import EmergencyRescuePage from './pages/rescue/EmergencyRescuePage';
import { NotificationProvider } from './context/NotificationContext';
import AIAssistant from './components/chatbot/AIAssistant';

import { PetProvider } from './context/PetContext';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/dashboard/Dashboard';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <PetProvider>
        <Router>
          <div className="min-h-screen bg-warm-beige flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <NotificationProvider>
                <Routes>
                <Route path="/" element={<HomePage />} />

                <Route path="/dashboard" element={

                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/browse" element={<BrowsePetsPage />} />
                <Route path="/pet/:id" element={<PetDetailsPage />} />
                <Route path="/add-pet" element={<AddPetPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/call/:petId" element={<CallPage />} />
                <Route path="/chat/:petId" element={<ChatPage />} />
                <Route path="/report-lost" element={<ReportLostPetPage />} />
                <Route path="/report-found" element={<ReportFoundPetPage />} />
                <Route path="/pets" element={<BrowsePetsPage />} />
                <Route path="/my-pets" element={
                  <ProtectedRoute>
                    <MyPetsPage />
                  </ProtectedRoute>
                } />
                <Route path="/lost-pets" element={<LostPetsPage />} />
                <Route path="/pets/:id" element={<PetDetailsPage />} />
                <Route path="/adoption/apply" element={<AdoptionFormPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/report-sighting/:petId" element={<ReportLostPetPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/health" element={<DiseasePredictionPage />} />
                <Route path="/breed-detect" element={<BreedDetectionPage />} />
                <Route path="/adoption" element={<AdoptionPage />} />
                <Route path="/ai/disease" element={<DiseasePredictionPage />} />
                <Route path="/ai/breed" element={<BreedDetectionPage />} />
                <Route path="/ai/chat" element={<AIChatPage />} />
                <Route path="/rescue" element={<EmergencyRescuePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/volunteer" element={
                  <ProtectedRoute>
                    <VolunteerPage />
                  </ProtectedRoute>
                } />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
                </NotificationProvider>

            </main>
            <Footer />
            <AIAssistant />
          </div>
        </Router>
      </PetProvider>
    </AuthProvider>
  );
}

export default App;

