// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './screens/Homepage/Homepage';
import Signup from './screens/Signup/Signup';
import Login from './screens/Login/Login';
import Navbar from './components/NavBar/NavBar';
import Contact from './screens/Contact/Contact';
import HELP from './components/HELP/HELP';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/admin" element={<Signup />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/help" element={<HELP />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
