import React from 'react';
import BankInfo from '../../components/BankInfo/BankInfo';
import Statistics from '../../components/Statistics/Statistics';
import AboutInfo from '../../components/About/AboutInfo';
import Contact from '../../components/Contact/Contact';
import './Miscellaneous.css';

const Miscellaneous = () => {
  return (
    <div className="miscellaneous">
      <h1>שונות</h1>
      <div className="miscellaneous-content">
        <div className="section-bank">
          <h2>פרטי בנק</h2>
          <BankInfo />
        </div>
        <div className="section">
          <h2>סטטיסטיקות</h2>
          <Statistics />
        </div>
        <div className="section">
          <h2>פרטי קשר</h2>
          <Contact />
        </div>
        <div className="section">
          <h2>אודות</h2>
          <AboutInfo />
        </div>
      </div>
    </div>
  );
};

export default Miscellaneous;
