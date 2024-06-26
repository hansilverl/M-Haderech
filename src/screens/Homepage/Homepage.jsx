import React from 'react';
import Footer from '../../components/Footer/Footer';
import './Homepage.css'
import PostsSection from '../../components/PostSection/PostSection';
import AnalyticsSection from '../../components/AnalyticsSection/AnalyticsSection';
import DonationSection from '../../components/DonationSection/DonationSection';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate()

  const handleFormClick = () => {
    navigate('/helpScore')
  }

  return (
    <div className="homepage" dir="rtl">
      <header className="header">
        <div className="header-image-container">
          <img src="https://images.inc.com/uploaded_files/image/1920x1080/evan-kirby-101570_199211.jpg" alt="Em Haderech" className="header-image" />
          <div className="header-text">
            <h1>ברוכים הבאים לאם הדרך</h1>
            <button onClick={handleFormClick} className="fill-form-button">מילוי טופס</button>
          </div>
        </div>
      </header>
      <main>
        <section id="about">
          <h2>אודותינו</h2>
          <p>למידע נוסף על המשימה והערכים שלנו...</p>
        </section>
        <PostsSection />
        <AnalyticsSection />
        <DonationSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;