import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './Miscellaneous.css';

const Miscellaneous = () => {
  const [bankInfo, setBankInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBankInfo = async () => {
      try {
        console.log("Attempting to fetch document from Firestore...");
        const docRef = doc(db, 'miscellaneous', 'bank_information');
        console.log("Document reference path:", docRef.path);
        const bankDoc = await getDoc(docRef);
        if (bankDoc.exists()) {
          console.log("Document found:", bankDoc.data());
          setBankInfo(bankDoc.data());
        } else {
          console.error("No such document found.");
          setError('No bank information found.');
        }
      } catch (err) {
        console.error("Error while fetching document:", err);
        setError('Failed to fetch bank information.');
      } finally {
        setLoading(false);
      }
    };

    fetchBankInfo();
  }, []);

  const handleUpdateBankInfo = async () => {
    const newBankInfo = prompt('Enter new bank information:', JSON.stringify(bankInfo, null, 2));
    if (newBankInfo) {
      try {
        const parsedBankInfo = JSON.parse(newBankInfo);
        const docRef = doc(db, 'miscellaneous', 'bank_information');
        await updateDoc(docRef, parsedBankInfo);
        setBankInfo(parsedBankInfo);
        alert('Bank information updated successfully.');
      } catch (error) {
        console.error('Error updating bank information: ', error);
        alert('Error updating bank information.');
      }
    }
  };

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <div className="miscellaneous">
      <h1>שונות</h1>
      <div className="bank-info-item">
        <h2>פרטי בנק</h2>
        {bankInfo && (
          <div>
            {Object.entries(bankInfo).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
          </div>
        )}
        <button onClick={handleUpdateBankInfo}>עדכן</button>
      </div>
    </div>
  );
};

export default Miscellaneous;
