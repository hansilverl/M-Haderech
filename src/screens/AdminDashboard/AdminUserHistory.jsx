import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './AdminUserHistory.css';

const AdminUserHistory = () => {
  const [email, setEmail] = useState('');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  }, [email]);

  const openModal = (entry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEntry(null);
    setIsModalOpen(false);
  };

  return (
    <div className="admin-user-history-container">
      <h1>צפייה בהיסטוריית שאלונים</h1>
      <input
        type="email"
        placeholder="הזן כתובת אימייל"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="search-input"
      />
      {error && <p className="error-message">{error}</p>}
      {history.length === 0 && !error && <p className="no-history">אין היסטוריה לשאלונים עבור אימייל זה</p>}
      <div className="history-grid">
        {history.map((entry, index) => (
          <div key={index} className="history-entry">
            <h2>תאריך: {new Date(entry.timestamp.seconds * 1000).toLocaleDateString('he-IL')}</h2>
            <p className="total-score">ציון כולל: {entry.totalScore}</p>
            <button onClick={() => openModal(entry)}>הצג פרטים</button>
          </div>
        ))}
      </div>
      {isModalOpen && selectedEntry && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>תאריך: {new Date(selectedEntry.timestamp.seconds * 1000).toLocaleDateString('he-IL')}</h2>
            <p>ציון כולל: {selectedEntry.totalScore}</p>
            <ul>
              {selectedEntry.responses.map((response, idx) => (
                <li key={idx}>
                  <strong>שאלה:</strong> {response.question}<br />
                  <strong>תשובה נבחרה:</strong> {response.selectedOption}<br />
                  <strong>ציון:</strong> {response.score}
                </li>
              ))}
            </ul>
            <button onClick={closeModal}>סגור</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserHistory;
