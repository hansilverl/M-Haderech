import 'normalize.css'
import './App.css'

import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './screens/Homepage/Homepage'
import Signup from './screens/Signup/Signup'
import Login from './screens/Login/Login'
import Navbar from './components/NavBar/NavBar'
import Contact from './screens/Contact/Contact'
import AdminDashboard from './screens/AdminDashboard/AdminDashboard'
import HelpScoreForm from './screens/Helpscore/HelpScoreForm'
import CalculateHelpScore from './screens/Helpscore/CalculateHelpScore'
import History from './screens/History/History'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import DonatePage from './screens/DonatePage/DonatePage'
import Articles from './screens/Posts/Articles'
import { LoginPopup } from './components/LoginPopup/LoginPopup'
import PostDetails from './screens/PostDetails/PostDetails'
import Conventions from './screens/Conventions/Conventions'

function App() {
	const location = useLocation()
	const isAdminRoute = location.pathname.startsWith('/admin')
	const [showLogin, setShowLogin] = useState(false) // State to manage LoginPopup visibility

	const { pathname } = useLocation()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [pathname])

	return (
		<div className='App'>
			{!isAdminRoute && <Navbar setShowLogin={setShowLogin} />} {/* Pass setShowLogin */}
			{showLogin && <LoginPopup setShowLogin={setShowLogin} />}
			<div className='App-content'>
				<Routes>
					<Route exact path='/' element={<HomePage />} />
					<Route exact path='/about' element={<PostDetails id={'about-us'} />} />
					<Route exact path='/thanks' element={<PostDetails id={'thanks'} />} />
					<Route exact path='/signup' element={<Signup />} />
					<Route exact path='/login' element={<Login />} />
					<Route exact path='/contact' element={<Contact />} />
					<Route exact path='/helpScore' element={<HelpScoreForm />} />
					<Route exact path='/calculateHelpScore' element={<CalculateHelpScore />} />
					<Route
						exact
						path='/history'
						element={
							<ProtectedRoute>
								<History />
							</ProtectedRoute>
						}
					/>
					<Route exact path='/articles' element={<Articles />} />
					<Route path='/posts/:id' element={<PostDetails />} /> {/* Route for detail of post */}
					<Route exact path='/donate' element={<DonatePage />} />
					<Route exact path='/conventions' element={<Conventions />} />
					<Route
						path='/admin/*'
						element={
							<ProtectedRoute admin>
								<AdminDashboard />
							</ProtectedRoute>
						}
					/>
				</Routes>
				{/* analytics.js tag */}
				<script async src="https://www.googletagmanager.com/gtag/js?id=G-XTE5N7RJJM"></script>
				</div>
		</div>
	)
}

const AppWrapper = () => (
	<Router>
		<App />
	</Router>
)

export default AppWrapper
