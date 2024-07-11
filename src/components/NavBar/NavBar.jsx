/*src/components/NavBar/NavBar.jsx*/
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogout } from '../../hooks/useLogout';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import './Navbar.css';
import logo from '../../assets/logo_white.png'; // Import the logo image

const Navbar = ({ setShowLogin }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useLogout();
  const { user, isAdmin } = useAuthStatus();
  const navigate = useNavigate();

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
      setDropdownOpen(false);
    }
  };

  const toggleMenu = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Em Haderech Logo" />
        </Link>
      </div>
      <div className="navbar-container">
        <div className={`hamburger ${dropdownOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div />
          <div />
          <div />
        </div>
        <ul className={`navbar-menu ${dropdownOpen ? 'active' : ''}`}>
          <li><a href="/" onClick={openPosts}>דף הבית</a></li>
          <li><a href="/posts" onClick={openPosts}>פוסטים</a></li>
          <li><a href="#about" onClick={handleScroll}>קצת עלינו</a></li>
          <li><a href="#donate" onClick={handleScroll}>כנסים</a></li>
          <li><Link to="/helpScore" onClick={() => setDropdownOpen(false)}>מילוי שאלון</Link></li>
          <li><Link to="/contact" onClick={() => setDropdownOpen(false)}>צור קשר</Link></li>
          <li><Link to="/donate" onClick={() => setDropdownOpen(false)}>תרומה</Link></li>
        </ul>
      </div>
      <div className="login-wrapper">
        {user ? (
          <div
            className="user-icon"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="user-disp">
              <FontAwesomeIcon icon={faUser} style={{ color: "#ffffff" }} className="user-svg" />
              <desc className="user-desc"
              > איזור אישי</desc>
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/history" onClick={() => setDropdownOpen(false)}>היסטוריה</Link>
                <hr class="solid"></hr>
                <Link to="/changePassword" onClick={() => setDropdownOpen(false)}>איפוס סיסמא</Link>
                <hr class="solid"></hr>
                {isAdmin && <Link to="/admin" onClick={() => setDropdownOpen(false)}>ניהול</Link>}
                {/* add hr if admin */}
                {isAdmin && <hr class="solid"></hr>}
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
