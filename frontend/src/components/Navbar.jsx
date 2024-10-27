import React, { useEffect } from 'react';
import './navbar.css';
import logo from './tcg-logo.png';

const Navbar = () => {
  useEffect(() => {
    const currentPage = window.location.pathname;
    const links = document.querySelectorAll('.nav-item a');

    links.forEach((link) => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active-link');
      } else {
        link.classList.remove('active-link');
      }
    });
  }, []);

  return (
    <div className="nav-wrapper">
      <nav className="navbar">
        <a href="/">
          <img src= {logo} alt="Logo Perso" className="logo" />
        </a>
        <ul className="nav">
          <li className="nav-item"><a href="/">Home</a></li>
          <li className="nav-item"><a href="/marketPlace">MarketPlace</a></li>
          <li className="nav-item"><a href="/profile">Profile</a></li>
          <li className="nav-item"><a href="/booster">Booster</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
