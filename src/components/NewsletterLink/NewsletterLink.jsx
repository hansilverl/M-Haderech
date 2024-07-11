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
        <h2>ניוזלטר</h2>
        <p>כדי להישאר מעודכנים בכל החדשות והעדכונים שלנו, הירשמו לניוזלטר שלנו.</p>
        <p><strong>קישור לניוזלטר:</strong> <a href={newsletterLink} target="_blank" rel="noopener noreferrer">{newsletterLink}</a></p>
      </div>
    </section>
  );
};

export default NewsletterLink;
