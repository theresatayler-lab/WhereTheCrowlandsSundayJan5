import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Deities } from './pages/Deities';
import { HistoricalFigures } from './pages/HistoricalFigures';
import { SacredSites } from './pages/SacredSites';
import { Rituals } from './pages/Rituals';
import { Timeline } from './pages/Timeline';
import { AIChat } from './pages/AIChat';
import { AIImage } from './pages/AIImage';
import { Profile } from './pages/Profile';
import { SpellRequest } from './pages/SpellRequest';
import { Guides } from './pages/Guides';
import { MyGrimoire } from './pages/MyGrimoire';
import { Footer } from './components/Footer';
import { OnboardingModal } from './components/OnboardingModal';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [selectedArchetype, setSelectedArchetype] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Load saved archetype
    const savedArchetype = localStorage.getItem('crowlands_selected_archetype');
    if (savedArchetype) {
      setSelectedArchetype(savedArchetype);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleSelectArchetype = (archetypeId) => {
    setSelectedArchetype(archetypeId);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <OnboardingModal onSelectArchetype={handleSelectArchetype} />
        <Navigation user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
          <Route path="/spell-request" element={<SpellRequest selectedArchetype={selectedArchetype} />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/deities" element={<Deities />} />
          <Route path="/figures" element={<HistoricalFigures />} />
          <Route path="/sites" element={<SacredSites />} />
          <Route path="/rituals" element={<Rituals />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/ai-chat" element={<AIChat selectedArchetype={selectedArchetype} />} />
          <Route path="/ai-image" element={<AIImage />} />
          <Route
            path="/my-grimoire"
            element={user ? <MyGrimoire /> : <Navigate to="/auth" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile user={user} /> : <Navigate to="/auth" />}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;