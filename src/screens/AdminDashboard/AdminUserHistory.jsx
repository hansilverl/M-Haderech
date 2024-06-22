import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { CSVLink } from 'react-csv';
import './AdminUserHistory.css';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Adjust this selector to your app's root element

const AdminUserHistory = () => {
  const [email, setEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answerStats, setAnswerStats] = useState({});

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        let q = collection(db, 'QuestionnaireHistory');
        const conditions = [];
        if (email !== '') {
          conditions.push(where('userEmail', '==', email));
        }
        if (startDate !== '') {
          conditions.push(where('timestamp', '>=', new Date(startDate)));
        }
        if (endDate !== '') {
          conditions.push(where('timestamp', '<=', new Date(endDate)));
        }

        q = query(q, ...conditions);

        const querySnapshot = await getDocs(q);
        const historyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistory(historyData);
        calculateAnswerStats(historyData);
        setError(null);
      } catch (error) {
        console.error('Error fetching history: ', error);
        setError('Error fetching history.');
        setHistory([]);
      }
    };

    fetchHistory();
  }, [email, startDate, endDate]);

  const calculateAnswerStats = (historyData) => {
    const stats = {};
    historyData.forEach(entry => {
      entry.responses.forEach(response => {
        if (!stats[response.question]) {
          stats[response.question] = {};
        }
        if (!stats[response.question][response.selectedOption]) {
          stats[response.question][response.selectedOption] = 0;
        }
        stats[response.question][response.selectedOption]++;
      });
    });
    setAnswerStats(stats);
  };

  const openModal = (entry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEntry(null);
    setIsModalOpen(false);
  };

  const csvData = history.map(entry => ({
    Date: new Date(entry.timestamp.seconds * 1000).toLocaleDateString('he-IL'),
    'Total Score': entry.totalScore,
    Details: entry.responses.map(response => `${response.question}: ${response.selectedOption}`).join('\n')
  }));

  return (
    <div className="admin-user-history-container">
      <h1>צפייה בהיסטוריית שאלונים</h1>
      <div className="filter-container">
        <label>אימייל:</label>
        <input
          type="email"
          placeholder="הזן כתובת אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="search-input"
        />
        <label>תאריך התחלה:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="search-input"
        />
        <label>תאריך סיום (לא כולל):</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="search-input"
        />
      </div>
      <CSVLink data={csvData} filename="history.csv" className="export-button">יצא ל-CSV</CSVLink>
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
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
        {selectedEntry && (
          <div>
            <h2>תאריך: {new Date(selectedEntry.timestamp.seconds * 1000).toLocaleDateString('he-IL')}</h2>
            <p>ציון כולל: {selectedEntry.totalScore}</p>
            <div className="response-list">
              {selectedEntry.responses.map((response, idx) => (
                <div key={idx} className="response-item">
                  <p><strong>שאלה:</strong> {response.question}</p>
                  <p><strong>תשובה נבחרה:</strong> {response.selectedOption}</p>
                  <p><strong>ציון:</strong> {response.score}</p>
                </div>
              ))}
            </div>
            <button onClick={closeModal} className="modal-close-button">סגור</button>
          </div>
        )}
      </Modal>
      <div className="statistics-container">
        <h2>סטטיסטיקות של שאלות (לפי הפילטר שהוכנס):</h2>
        {Object.keys(answerStats).map(question => (
          <div key={question} className="question-stats-box">
            <h3>{question}</h3>
            <ul>
              {Object.keys(answerStats[question]).map(option => (
                <li key={option}>תשובה: {option}, סך הקולות: {answerStats[question][option]}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUserHistory;
