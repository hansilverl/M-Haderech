import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './AdminUserHistory.css';

const AdminUserHistory = () => {
  const [email, setEmail] = useState(''); // State to store the email input
  const [history, setHistory] = useState([]); // State to store the fetched history
  const [error, setError] = useState(null); // State to store any errors

  // Fetch history whenever the email state changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (email === '') {
        setHistory([]);
        setError(null);
        return;
      }

      try {
        const q = query(collection(db, 'QuestionnaireHistory'), where('userEmail', '==', email));
        const querySnapshot = await getDocs(q);
        const historyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistory(historyData);
        setError(null);
      } catch (error) {
        console.error('Error fetching history: ', error);
        setError('Error fetching history.');
        setHistory([]);
      }
    };

    fetchHistory();
  }, [email]); // Dependence array, fetch history when email changes

  return (
    <div className="admin-user-history-container">
      <h1>צפייה בהיסטוריית שאלונים</h1>
      <input
        type="email"
        placeholder="הזן כתובת אימייל"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='search-input'
      />
      {error && <p className="error-message">{error}</p>}
      {history.length === 0 && !error && <p>אין היסטוריה לשאלונים עבור אימייל זה</p>}
      {history.map((entry, index) => (
        <div key={index} className="history-entry">
          <h2>תאריך: {new Date(entry.timestamp.seconds * 1000).toLocaleDateString()}</h2>
          <p>ציון כולל: {entry.totalScore}</p>
          <ul>
            {entry.responses.map((response, idx) => (
              <li key={idx}>
                <strong>שאלה:</strong> {response.question}<br />
                <strong>תשובה נבחרה:</strong> {response.selectedOption}<br />
                <strong>ציון:</strong> {response.score}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AdminUserHistory;
