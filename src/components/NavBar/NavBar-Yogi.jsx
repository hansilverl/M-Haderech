import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogout'
import { useAuthStatus } from '../../hooks/useAuthStatus'
import './Navbar.css'
import logo from '../../assets/logo_white.png' // Import the logo image
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons'

const Navbar = ({ setShowLogin }) => {
	const [isOpen, setIsOpen] = useState(false)
	const { logout } = useLogout()
	const { user, isAdmin } = useAuthStatus()
	const navigate = useNavigate()
	const openPosts = () => {
		navigate('/posts')
	}

	const handleScroll = (event) => {
		event.preventDefault()
		const targetId = event.currentTarget.getAttribute('href').substring(1)
		const targetElement = document.getElementById(targetId)

		if (targetElement) {
			window.scrollTo({
				top: targetElement.offsetTop,
				behavior: 'smooth',
			})
		}

		// Close the menu on mobile after clicking a link
		if (window.innerWidth <= 768) {
			setIsOpen(false)
		}
	}

	const toggleMenu = () => {
		setIsOpen(!isOpen)
	}

	const handleLogout = () => {
		logout()
		setIsOpen(false)
		navigate('/')
	}

	return (
		<nav className='navbar'>
			<div className='navbar-container'>
				<div className={`hamburger ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
					<div />
					<div />
					<div />
				</div>
				<div className='navbar-logo'>
					<Link to='/'>
						<img src={logo} alt='Em Haderech Logo' />
					</Link>
				</div>
				<ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
					<li>
						<a href='/' onClick={openPosts}>
							דף הבית
						</a>
					</li>
					<li>
						<a href='/posts' onClick={openPosts}>
							פוסטים
						</a>
					</li>
					<li>
						<a href='#about' onClick={handleScroll}>
							קצת עלינו
						</a>
					</li>
					<li>
						<a href='#donate' onClick={handleScroll}>
							כנסים
						</a>
					</li>
					<li>
						<Link to='/helpScore' onClick={() => setIsOpen(false)}>
							מילוי שאלון
						</Link>
					</li>
					<li>
						<Link to='/contact' onClick={() => setIsOpen(false)}>
							צור קשר
						</Link>
					</li>
					<li>
						<Link to='/donate' onClick={() => setIsOpen(false)}>
							תרומה
						</Link>
					</li>
					{user ? (
						<>
							<li>
								<Link to='/history' onClick={() => setIsOpen(false)}>
									היסטוריה
								</Link>
							</li>
							<div className='space'></div>
							{isAdmin && (
								<li>
									<Link to='/admin' className='admin-logout' onClick={() => setIsOpen(false)}>
										ניהול
									</Link>
								</li>
							)}
							<li>
								<div className='logout-button admin-logout' onClick={handleLogout}>
									התנתקות
								</div>
							</li>
						</>
					) : (
						<li>
							<div className='login-button' onClick={() => setShowLogin(true)}>
								<FontAwesomeIcon icon={faRightToBracket} style={{ color: '#ffffff' }} />
								<div>התחברות</div>
							</div>
						</li>
					)}
				</ul>
			</div>
		</nav>
	)
}

export default Navbar
