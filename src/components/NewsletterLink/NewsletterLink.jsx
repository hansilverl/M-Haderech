// src/components/NewsletterLink/NewsletterLink.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import './NewsletterLink.css';

const NewsletterLink = () => {
  const [newsletterLink, setNewsletterLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsletterLink = async () => {
      try {
        const docRef = doc(db, 'miscellaneousUpdated', 'newsletter');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNewsletterLink(docSnap.data().newsletter);
        } else {
          setError('לא נמצא קישור לניוזלטר.');
        }
      } catch (err) {
        setError('נכשל בטעינת קישור לניוזלטר.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletterLink();
  }, []);

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <section className="newsletter-section">
      <div className="newsletter-text">
        <center><h2>חדשות ועדכונים</h2>
        <p>כדי להישאר מעודכנים בכל החדשות והעדכונים שלנו, הירשמו לרשימת התפוצה שלנו על ידי לחיצה <a href={newsletterLink} target="_blank" rel="noopener noreferrer">כאן</a>.</p></center>
      </div>
    </section>
  );
};

export default NewsletterLink;
