// src/components/NavBar/NavBar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLogout } from '../../hooks/useLogout';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import './Navbar.css';
import logo from '../../assets/logo_white.png'; // Import the logo image

const Navbar = ({ setShowLogin }) => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { logout } = useLogout();
  const { user, isAdmin } = useAuthStatus();
  const navigate = useNavigate();
  const location = useLocation();

  const openPosts = () => {
    navigate('/posts');
  };

  const handleScroll = (event) => {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth',
      });
    }

    // Close the menu on mobile after clicking a link
    if (window.innerWidth <= 768) {
      setNavbarOpen(false);
    }
  };

  const toggleNavbarMenu = () => {
    setNavbarOpen(!navbarOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active-link' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Em Haderech Logo" />
        </Link>
      </div>
      <div className="navbar-container">
        <div className={`hamburger ${navbarOpen ? 'open' : ''}`} onClick={toggleNavbarMenu}>
          <div />
          <div />
          <div />
        </div>
        <ul className={`navbar-menu ${navbarOpen ? 'active' : ''}`}>
          <li><Link to="/" className={isActive('/')}>דף הבית</Link></li>
          <li><Link to="/posts" className={isActive('/posts')}>פוסטים</Link></li>
          <li><a href="#about" onClick={handleScroll} className={isActive('#about')}>קצת עלינו</a></li>
          <li><a href="#donate" onClick={handleScroll} className={isActive('#donate')}>כנסים</a></li>
          <li><Link to="/helpScore" onClick={() => setNavbarOpen(false)} className={isActive('/helpScore')}>מילוי שאלון</Link></li>
          <li><Link to="/contact" onClick={() => setNavbarOpen(false)} className={isActive('/contact')}>צור קשר</Link></li>
          <li><Link to="/donate" onClick={() => setNavbarOpen(false)} className={isActive('/donate')}>תרומה</Link></li>
        </ul>
      </div>
      <div className="login-wrapper">
        {user ? (
          <div
            className="user-icon"
            onMouseEnter={() => setUserDropdownOpen(true)}
            onMouseLeave={() => setUserDropdownOpen(false)}
            onClick={toggleUserDropdown}
          >
            <div className="user-disp">
              <FontAwesomeIcon icon={faUser} style={{ color: "#ffffff" }} className="user-svg" />
              <div className="user-desc">איזור אישי</div>
            </div>
            {userDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/history" onClick={() => setUserDropdownOpen(false)}>היסטוריה</Link>
                <Link to="/changePassword" onClick={() => setUserDropdownOpen(false)}>איפוס סיסמא</Link>
                {isAdmin && <Link to="/admin" onClick={() => setUserDropdownOpen(false)}>ניהול</Link>}
                <div className="logout-button" onClick={handleLogout}>התנתקות</div>
              </div>
            )}
          </div>
        ) : (
          <span className="login-button" onClick={() => setShowLogin(true)}>התחברות</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
