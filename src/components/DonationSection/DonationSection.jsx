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
        <h2>נולדים חיים - נותנים חיים💗</h2>
        <p>כאן המקום שלך לתת חיים לאמהות שיכולות להתחיל לנשום ותינוקות שפותחים עיניים לחיים חדשים <b>בזכותך.</b></p>
        <br></br>
        <button className="donate-button" onClick={handleDonateClick}>תורמים חיים {">>"}</button>
      </div>
      <div className="donation-image">
        <img src="https://cdn.pixabay.com/photo/2014/05/01/01/43/dandelion-335222_1280.png" alt="donation illustration" className="donation-image" />
      </div>
    </section>
  );
};

export default DonationSection;
