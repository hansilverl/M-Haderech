import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import './DonatePage.css';

const DonatePage = () => {
  const [bankInfo, setBankInfo] = useState(null);
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
      } finally {
        setLoading(false);
      }
    };

    fetchBankInfo();
  }, []);

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <div className="donate-page">
      <h1>עמוד תרומה</h1>
      <p>כאן תוכלו לבצע את התרומה שלכם.</p>
      <div className="bank-info-box">
        <h2>מידע בנקאי</h2>
        {bankInfo && (
          <div>
            {Object.entries(bankInfo).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonatePage;
