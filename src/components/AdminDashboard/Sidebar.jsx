import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaRegNewspaper, FaUsers, FaCog, FaBars, FaTimes, FaQuestionCircle, FaSignOutAlt, FaHistory } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>לוח מחוונים של מנהל</h2>
          <button className="close-btn" onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>
        <ul className="sidebar-menu">
          <li>
            <Link to="/admin/posts" onClick={closeSidebar}>
              <FaRegNewspaper className="sidebar-icon" />
              <span>פוסטים</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/users" onClick={closeSidebar}>
              <FaUsers className="sidebar-icon" />
              <span>משתמשים</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/questionnaire" onClick={closeSidebar}>
              <FaQuestionCircle className="sidebar-icon" />
              <span>ניהול שאלון</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/miscellaneous" onClick={closeSidebar}>
              <FaCog className="sidebar-icon" />
              <span>שונות</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/history" onClick={closeSidebar}>
              <FaHistory className="sidebar-icon" />
              <span>צפייה בהיסטוריית שאלונים</span>
            </Link>
          </li>
          <li>
            <Link to="/" onClick={closeSidebar}>
              <FaSignOutAlt className="sidebar-icon" />
              <span>יציאה מדף ניהול</span>
            </Link>
          </li>
        </ul>
      </div>
      {!isOpen && (
        <button className="hamburger-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
      )}
    </>
  );
};

export default Sidebar;
