// src/App.js

import React, { useState } from 'react'
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
import './App.css'
import Posts from './screens/Posts/Posts'
import { LoginPopup } from './components/LoginPopup/LoginPopup'
import PostDetails from './screens/PostDetails/PostDetails'
import PostEditpage from './screens/PostEditpage/PostEditpage'

function App() {
	const location = useLocation()
	const isAdminRoute = location.pathname.startsWith('/admin')
	const [showLogin, setShowLogin] = useState(false) // State to manage LoginPopup visibility

	return (
		<div className='App'>
			{!isAdminRoute && <Navbar setShowLogin={setShowLogin} />} {/* Pass setShowLogin */}
			{showLogin && <LoginPopup setShowLogin={setShowLogin} />}
			<Routes>
				<Route exact path='/' element={<HomePage />} />
				<Route exact path='/signup' element={<Signup />} />
				<Route exact path='/login' element={<Login />} />
				<Route exact path='/contact' element={<Contact />} />
				<Route exact path='/helpScore' element={<HelpScoreForm />} />
				<Route exact path='/calculateHelpScore' element={<CalculateHelpScore />} />
				<Route exact path='/edit/:id' element={<PostEditpage />} />
				<Route
					exact
					path='/history'
					element={
						<ProtectedRoute>
							<History />
						</ProtectedRoute>
					}
				/>
				<Route exact path='/posts' element={<Posts />} />
				<Route path='/posts/:id' element={<PostDetails />} /> {/* Route for detail of post */}
				<Route exact path='/donate' element={<DonatePage />} />
				<Route
					path='/admin/*'
					element={
						<ProtectedRoute admin>
							<AdminDashboard />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</div>
	)
}

const AppWrapper = () => (
	<Router>
		<App />
	</Router>
)

export default AppWrapper
