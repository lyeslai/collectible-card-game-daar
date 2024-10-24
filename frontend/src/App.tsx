import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/Home';
import Cartes from './pages/Cartes';  // Importer Cartes ici
import Market from './pages/Market';
import Profile from './pages/Profile';
import Booster from './pages/Booster';
import MintCard from './pages/MintCard';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cards" element={<Cartes />} /> 
        <Route path="/market" element={<Market />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/booster" element={<Booster />} />
        <Route path="/mint" element={<MintCard />} />
      </Routes>
    </Router>
  );
}

export default App;
