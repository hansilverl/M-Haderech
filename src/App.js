import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './screens/Homepage/Homepage';
import Signup from './screens/Signup/Signup';
import Login from './screens/Login/Login';
import Navbar from './components/NavBar/NavBar';
import Contact from './screens/Contact/Contact';
import AdminDashboard from './screens/AdminDashboard/AdminDashboard';
import HelpScoreForm from './screens/Helpscore/HelpScoreForm';
import CalculateHelpScore from './screens/Helpscore/CalculateHelpScore';
import History from './screens/History/History'; // Import the new History component
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import './App.css';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/helpScore" element={<HelpScoreForm />} />
        <Route exact path="/calculateHelpScore" element={<CalculateHelpScore />} />
        <Route exact path="/history" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } /> {/* Add the protected route for history */}
        <Route path="/admin/*" element={
          <ProtectedRoute admin>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
