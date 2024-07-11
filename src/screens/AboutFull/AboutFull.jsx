// src/pages/AboutFull/AboutFull.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import './AboutFull.css';
import logo from '../../assets/logo.png'; // Adjust the path to your logo file

const AboutFull = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [text, setText] = useState('');
  const [additionalText, setAdditionalText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        const docRef = doc(db, 'miscellaneousUpdated', 'about_full');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setSubtitle(data.subtitle);
          setText(data.text);
          setAdditionalText(data.additionalText);
        } else {
          setError('לא נמצאה אינפורמציה עלינו.');
        }
      } catch (err) {
        setError('נכשל בטעינת אינפורמציה עלינו.');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutInfo();
  }, []);

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <div className="about-full">
      <div className="about-full-container">
        <img src={logo} alt="Logo" className="about-logo-right" />
        <h1>{title}</h1>
        <h2 className="subtitle-right">{subtitle}</h2>
        <p>{text}</p>
        <p>{additionalText}</p>
      </div>
    </div>
  );
};

export default AboutFull;
