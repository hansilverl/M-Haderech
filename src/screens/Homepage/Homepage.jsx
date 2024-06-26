import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import './Homepage.css';
import PostsSection from '../../components/PostSection/PostSection';
import AnalyticsSection from '../../components/AnalyticsSection/AnalyticsSection';
import DonationSection from '../../components/DonationSection/DonationSection';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const HomePage = () => {
  const navigate = useNavigate();
  const [aboutInfo, setAboutInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        const docRef = doc(db, 'miscellaneousUpdated', 'about'); // Adjust document path as per your Firestore structure
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

  const handleFormClick = () => {
    navigate('/helpScore');
  };

  return (
    <div className="homepage" dir="rtl">
      <header className="header">
        <div className="header-image-container">
          <img src="https://images.unsplash.com/photo-1505679208891-9ab12ee61dc1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Em Haderech" className="header-image" />
          <div className="header-text">
            <h1>ברוכים הבאים לאם הדרך</h1>
            <button onClick={handleFormClick} className="fill-form-button">מילוי שאלון</button>
          </div>
        </div>
      </header>
      <main>
        <section id="about">
          <h2>אודותינו</h2>
          {loading ? (
            <p>טוען...</p>
          ) : error ? (
            <p>שגיאה: {error}</p>
          ) : (
            <p>{aboutInfo}</p>
          )}
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
