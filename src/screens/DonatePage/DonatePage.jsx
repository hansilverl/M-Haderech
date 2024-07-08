import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { FaUniversity, FaLink, FaPhone } from 'react-icons/fa';
import './DonatePage.css';

const DonatePage = () => {
  const [bankInfo, setBankInfo] = useState(null);
  const [donationLink, setDonationLink] = useState('');
  const [donationNumber, setDonationNumber] = useState('');
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
          setDonationLink(docSnap.data().link);
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

    const fetchData = async () => {
      setLoading(true);
      await fetchBankInfo();
      await fetchDonationLink();
      await fetchDonationNumber();
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <div className="donate-page">
      <h1>עמוד תרומה</h1>
      <p>כאן תוכלו לבצע את התרומה שלכם.</p>
      <div className="info-container">
        <div className="info-box">
          <FaLink className="info-icon" />
          <h2>קישור לתרומה דרך האינטרנט</h2>
          <h4>ניתן לתרום דרך הקישור הבא:</h4>
          <p> <a href={donationLink} target="_blank" rel="noopener noreferrer">{donationLink}</a></p>
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
          <h4>לתרומה בטלפון התקשרו:</h4>
          <p>{donationNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
