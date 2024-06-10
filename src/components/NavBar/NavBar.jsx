import React, { useState } from 'react';
import './Navbar.css';
import logo from '../../assets/logo.png';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = (event) => {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth'
      });
    }

    // Close the menu on mobile after clicking a link
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        <div className={`hamburger ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div />
          <div />
          <div />
        </div>
        <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <li><a href="#posts" onClick={handleScroll}>פוסטים</a></li>
          <li><a href="#about" onClick={handleScroll}>קצת עלינו </a></li>
          <li><a href="#donate" onClick={handleScroll}>כנסים</a></li>
          <li><a href="#donate" onClick={handleScroll}>מילוי טופס</a></li>
          <li><a href="#contact" onClick={handleScroll}>צור קשר</a></li>
          <li><a href="#donate" onClick={handleScroll}>לתרומה</a></li>
        </ul>
        <div className="navbar-logo">
        <img src={logo} alt="Em Haderech" width="90" />
                </div>
      </div>
    </nav>
  );
};

export default Navbar;
