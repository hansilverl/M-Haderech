// src/pages/HomePage/HomePage.js
import './Homepage.css';
import React, { useState, useEffect, useRef } from 'react';
import PostsSection from '../../components/PostSection/PostSection';
import AnalyticsSection from '../../components/AnalyticsSection/AnalyticsSection';
import DonationSection from '../../components/DonationSection/DonationSection';
import NewsletterLink from '../../components/NewsletterLink/NewsletterLink'; // Import the updated component
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import headerImage from '../../assets/michal-bar-haim-NYvRaxVZ-_M-unsplash.jpg';

const HomePage = () => {
  const navigate = useNavigate();
  const [aboutInfo, setAboutInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsInView, setAnalyticsInView] = useState(false);
  const analyticsRef = useRef(null);

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        const docRef = doc(db, 'miscellaneousUpdated', 'about');
        const aboutDoc = await getDoc(docRef);
        if (aboutDoc.exists()) {
          setAboutInfo(aboutDoc.data().about);
        } else {
          setError('לא נמצאה אינפורמציית אודות.');
        }
      } catch (err) {
        setError('נכשל בטעינת אינפורמציית אודות.');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutInfo();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnalyticsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (analyticsRef.current) {
      observer.observe(analyticsRef.current);
    }

    return () => {
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
    };
  }, []);

  const handleFormClick = () => {
    navigate('/helpScore');
  };

  return (
    <div className="homepage" dir="rtl">
      <header className="header">
        <div className="header-image-container">
        <img src={headerImage} alt="Em Haderech" className="header-image" />
          <div className="header-text">
            <h1>ברוכות הבאות לאם הדרך </h1>
            <h3>
              היפרמאזיס - אפשר לחיות עם זה
            </h3>
            <button onClick={handleFormClick} className="fill-form-button">מילוי מבדק</button>
          </div>
        </div>
      </header>
      <main>
        <section id="about">
          <h2>להכיר היפרמאזיס אחרת 
          </h2>
          {loading ? (
            <p>טוען...</p>
          ) : error ? (
            <p>שגיאה: {error}</p>
          ) : (
            <h3><p>{aboutInfo}</p></h3>
          )}
        </section>
        <PostsSection />
        <div ref={analyticsRef}>
          <AnalyticsSection animate={analyticsInView} />
        </div>
        <DonationSection />
      </main>
      <NewsletterLink /> {/* Add the updated component */}
    </div>
  );
};

export default HomePage;
