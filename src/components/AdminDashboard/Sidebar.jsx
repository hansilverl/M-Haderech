import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegNewspaper, FaUsers, FaQuestionCircle, FaCog, FaBars, FaTimes, FaSignOutAlt, FaHistory } from 'react-icons/fa';
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
				<div className='sidebar-header'>
					<h2>ניהול</h2>
					<button className='close-btn' onClick={toggleSidebar}>
						<FaTimes />
					</button>
				</div>
				<ul className='sidebar-menu'>
					<li>
						<Link to='/admin/posts' onClick={closeSidebar}>
							<FaRegNewspaper className='sidebar-icon' />
							<span>ניהול תוכן</span>
						</Link>
					</li>
					<li>
						<Link to='/admin/edit/about-us' onClick={closeSidebar}>
							<FaRegNewspaper className='sidebar-icon' />
							<span>עריכת קצת עלינו</span>
						</Link>
					</li>
					<li>
						<Link to='/admin/edit/thanks' onClick={closeSidebar}>
							<FaRegNewspaper className='sidebar-icon' />
							<span>עריכת תודות</span>
						</Link>
					</li>
					<li>
						<Link to='/admin/users' onClick={closeSidebar}>
							<FaUsers className='sidebar-icon' />
							<span>משתמשות</span>
						</Link>
					</li>
					<li>
						<Link to='/admin/questionnaire' onClick={closeSidebar}>
							<FaQuestionCircle className='sidebar-icon' />
							<span>ניהול מבדק</span>
						</Link>
					</li>
					<li>
						<Link to='/admin/history' onClick={closeSidebar}>
							<FaHistory className='sidebar-icon' />
							<span>צפייה בהיסטוריית מבדקים</span>
						</Link>
					</li>
					<li>
						<Link to='/admin/miscellaneous' onClick={closeSidebar}>
							<FaCog className='sidebar-icon' />
							<span>שונות</span>
						</Link>
					</li>
					<li>
						<Link to='/' onClick={closeSidebar}>
							<FaSignOutAlt className='sidebar-icon' />
							<span>יציאה מדף ניהול</span>
						</Link>
					</li>
				</ul>
			</div>
			{!isOpen && (
				<button className='hamburger-btn' onClick={toggleSidebar}>
					<FaBars />
				</button>
			)}
		</>
	)
};

export default Sidebar;
