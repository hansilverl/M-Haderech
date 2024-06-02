import React from 'react';
import Navbar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import './Homepage.css'
import PostsSection from '../../components/PostSection/PostSection';
import AnalyticsSection from '../../components/AnalyticsSection/AnalyticsSection';

const HomePage = () => {
  return (
    <div className="homepage" dir="rtl">
      <Navbar />
      <header className="header">
        <div className="header-image-container">
          <img src="https://images.inc.com/uploaded_files/image/1920x1080/evan-kirby-101570_199211.jpg" alt="Em Haderech" className="header-image" />
          <div className="header-text">
            <h1>ברוכים הבאים ל-Em Haderech</h1>
            <p>התרומות שלכם עושות את ההבדל</p>
            <button className="fill-form-button">מילוי טופס</button>
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
        <section id="donate">
          <h2>תרומה</h2>
          <p>התרומות שלכם עוזרות לנו מאוד. לחצו על הכפתור למטה כדי לתרום.</p>
          <button className="donate-button">תרמו עכשיו</button>
        </section>
        <section id="contact">
          <h2>צור קשר</h2>
          <p>צרו איתנו קשר למידע נוסף...</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;