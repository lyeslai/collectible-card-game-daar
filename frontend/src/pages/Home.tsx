// src/pages/Home.tsx

import React from 'react';
import Navbar from '../components/navbar';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <Navbar />

      <main>
        <div className="hero">
          <img className="hero-image" src="src/assets/bg-pokemon.jpg" alt="Hero" />
          <div className="hero-text">
            <h1>Welcome to Pokémon TCG</h1>
            <p>Explore cards, open boosters, and trade on the market!</p>
          </div>
        </div>
      </main>    </div>
  );
};

export default Home;
