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
        <img src="https://back.notaria-online.com/wp-content/uploads/2022/11/donacion-de-dinero-a-un-familiar.png" alt="Gráfico de Ejemplo" className="donation-image" />
      </div>
    </section>
  );
};

export default DonationSection;
