import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <h2 className="navbar-logo">Pokémon TCG</h2>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/cards">Cards</Link></li>
        <li><Link to="/market">Market</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/booster">Booster</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
