import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';import logo from './logo.svg';
import './App.css';
import question from './HelpQuestionnaire';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          {/* <li><a href="/tools/help-score">HELP Score</a></li> */}
          <Routes>
          <Route path="/questionnaire" element={<HelpQuestionnaire />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;