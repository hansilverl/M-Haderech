<<<<<<< Updated upstream
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './screens/Homepage/Homepage';
import Signup from './screens/Signup/Signup';
import Login from './screens/Login/Login';
import Navbar from './components/NavBar/NavBar';
import Contact from './screens/Contact/Contact';
import AdminDashboard from './screens/AdminDashboard/AdminDashboard';
import HelpScoreForm from './components/helpScore/HelpScoreForm';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import './App.css';
=======
import React from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './screens/Homepage/Homepage'
import Signup from './screens/Signup/Signup'
import Login from './screens/Login/Login'
import Navbar from './components/NavBar/NavBar'
import Contact from './screens/Contact/Contact'
import AdminDashboard from './screens/AdminDashboard/AdminDashboard'
import EditPostPage from './screens/EditPost/TextEditor'
import './App.css'
>>>>>>> Stashed changes

function App() {
	const location = useLocation()
	const isAdminRoute = location.pathname.startsWith('/admin')

<<<<<<< Updated upstream
  return (
    <div className="App">
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/helpScore" element={<HelpScoreForm />} />
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
=======
	return (
		<div className='App'>
			{!isAdminRoute && <Navbar />}
			<Routes>
				<Route exact path='/' element={<HomePage />} />
				<Route exact path='/signup' element={<Signup />} />
				<Route exact path='/login' element={<Login />} />
				<Route exact path='/contact' element={<Contact />} />
				<Route path='/admin/*' element={<AdminDashboard />} />
				<Route exact path='/edit' element={<EditPostPage />} />
			</Routes>
		</div>
	)
>>>>>>> Stashed changes
}

const AppWrapper = () => (
	<Router>
		<App />
	</Router>
)

export default AppWrapper
