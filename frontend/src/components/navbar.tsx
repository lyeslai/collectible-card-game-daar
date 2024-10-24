// src/components/Navbar.tsx

import React from 'react';
import './navbar.css';

const Navbar: React.FC = () => {
  return (
    <header className="navbar">
      <div className="logo">
        <img src="src/assets/tcg-logo.png" alt="Pokemon TCG Logo" />
      </div>
      <nav>
        <ul>
          <li><a href="#cartes">Cartes</a></li>
          <li><a href="#market">Market</a></li>
          <li><a href="#mes-cartes">Mes Cartes</a></li>
          <li><a href="#booster">Booster</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
