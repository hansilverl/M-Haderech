import React from 'react';
import './Navbar.css';

const Navbar = () => {
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
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="navbar-menu">
          <li><a href="#posts" onClick={handleScroll}>פוסטים</a></li>
          <li><a href="#about" onClick={handleScroll}>קצת עלינו </a></li>
          <li><a href="#donate" onClick={handleScroll}>כנסים</a></li>
          <li><a href="#donate" onClick={handleScroll}>מילוי טופס</a></li>
          <li><a href="#contact" onClick={handleScroll}>צור קשר</a></li>
          <li><a href="#donate" onClick={handleScroll}>לתרומה</a></li>
        </ul>
        <div className="navbar-logo">
          Em Haderech Logo
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
