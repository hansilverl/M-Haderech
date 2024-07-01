// src/components/DonationSection/DonationSection.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DonationSection.style.css';

const DonationSection = () => {
  const navigate = useNavigate();

  const handleDonateClick = () => {
    navigate('/donate');
  };

  return (
    <section id="donate" className="donation-section">
      <div className="donation-text">
        <h2>תרומה</h2>
        <p>התרומות שלכם עוזרות לנו מאוד. לחצו על הכפתור למטה כדי לתרום.</p>
        <button className="donate-button" onClick={handleDonateClick}>תרמו עכשיו</button>
      </div>
      <div className="donation-image">
        <img src="https://cdn.pixabay.com/photo/2014/05/01/01/43/dandelion-335222_1280.png" alt="donation illustration" className="donation-image" />
      </div>
    </section>
  );
};

export default DonationSection;
