import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="navbar-menu">
          <li><a href="#about">פוסטים</a></li>
          <li><a href="#services">קצת עלינו </a></li>
          <li><a href="#donate">כנסים</a></li>
          <li><a href="#donate">מילוי טופס</a></li>
          <li><a href="#contact">צור קשר</a></li>
          <li><a href="#donate">לתרומה</a></li>
        </ul>
        <div className="navbar-logo">
          Em Haderech Logo
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
