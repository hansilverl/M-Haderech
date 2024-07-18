// src/pages/DonatePage/DonatePage.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { FaUniversity, FaLink, FaPhone } from 'react-icons/fa';
import './DonatePage.css';

const DonatePage = () => {
  const [bankInfo, setBankInfo] = useState(null);
  const [donationLinkHebrew, setDonationLinkHebrew] = useState('');
  const [donationLinkEnglish, setDonationLinkEnglish] = useState('');
  const [donationNumber, setDonationNumber] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBankInfo = async () => {
      try {
        const docRef = doc(db, 'miscellaneousUpdated', 'bank_information');
        const bankDoc = await getDoc(docRef);
        if (bankDoc.exists()) {
          setBankInfo(bankDoc.data());
        } else {
          setError('לא נמצאה מידע בנקאי.');
        }
      } catch (err) {
        setError('נכשל בטעינת מידע בנקאי.');
      }
    };

    const fetchDonationLink = async () => {
      try {
        const docRef = doc(db, 'miscellaneousUpdated', 'donate_link');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDonationLinkHebrew(docSnap.data().link_hebrew);
          setDonationLinkEnglish(docSnap.data().link_english);
        } else {
          setError('לא נמצא קישור תרומה.');
        }
      } catch (err) {
        setError('נכשל בטעינת קישור תרומה.');
      }
    };

    const fetchDonationNumber = async () => {
      try {
        const docRef = doc(db, 'miscellaneousUpdated', 'donate_number');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDonationNumber(docSnap.data().number);
        } else {
          setError('לא נמצא מספר תרומה.');
        }
      } catch (err) {
        setError('נכשל בטעינת מספר תרומה.');
      }
    };

    const fetchTitleAndSubtitle = async () => {
      try {
        const docRef = doc(db, 'miscellaneousUpdated', 'donate_title');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTitle(docSnap.data().title);
          setSubtitle(docSnap.data().subtitle);
        } else {
          setError('לא נמצא כותרת לעמוד תרומה.');
        }
      } catch (err) {
        setError('נכשל בטעינת כותרת לעמוד תרומה.');
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchBankInfo();
      await fetchDonationLink();
      await fetchDonationNumber();
      await fetchTitleAndSubtitle();
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <div className="donate-page">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <div className="info-container">
        <div className="info-box">
          <FaLink className="info-icon" />
          <h2>קישור לתרומה דרך האינטרנט</h2>
          <h4>ניתן לתרום דרך הקישורים הבאים:</h4>
          <p><a href={donationLinkHebrew} target="_blank" rel="noopener noreferrer">תרומה בעברית</a></p>
          <p><a href={donationLinkEnglish} target="_blank" rel="noopener noreferrer">Donate in English</a></p>
        </div>
        <div className="info-box">
          <FaUniversity className="info-icon" />
          <h2>מידע בנקאי</h2>
          {bankInfo && (
            <div>
              {Object.entries(bankInfo).map(([key, value]) => (
                <p key={key}><strong>{key}:</strong> {value}</p>
              ))}
            </div>
          )}
        </div>
        <div className="info-box">
          <FaPhone className="info-icon" />
          <h2>מספר תרומה</h2>
          <h4>לתרומה טלפונית חייגו: 
          </h4>
          <p>{donationNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
