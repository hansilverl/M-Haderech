import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]); // State to store the user's questionnaire history
  const { user } = useAuthStatus(); // Hook to get the current authenticated user
  const [error, setError] = useState(null); // State to store any errors that occur

  useEffect(() => {
    // Fetch the history only if a user is logged in
    if (user) {
      const fetchHistory = async () => {
        try {
          const q = query(collection(db, 'QuestionnaireHistory'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const historyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setHistory(historyData);
          setError(null); // Clear any previous errors
        } catch (error) {
          console.error('Error fetching history: ', error);
          setError('Error fetching history.');
          setHistory([]); // Clear history on error
        }
      };

      fetchHistory();
    }
  }, [user]); // Dependency array to refetch history if the user changes

  // Function to handle the deletion of a history entry
  const handleDelete = async (id) => {
    const confirmation = window.confirm('האם אתה בטוח שברצונך למחוק את ההיסטוריה הזו?');
    if (confirmation) {
      try {
        await deleteDoc(doc(db, 'QuestionnaireHistory', id));
        setHistory(history.filter(item => item.id !== id)); // Remove deleted entry from state
      } catch (error) {
        console.error('Error deleting history: ', error);
        alert('שגיאה במחיקת ההיסטוריה.');
      }
    }
  };

  return (
    <div className="history-container">
      <h1>היסטוריה של השאלונים שלי</h1>
      {error && <p className="error-message">{error}</p>}
      {history.length === 0 && !error ? (
        <div>
          <p className="no-history">אין לך היסטוריה</p>
          <button className="fill-questionnaire-button" onClick={() => window.location.href = '/helpScore'}>
            מלא שאלון
          </button>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((entry, index) => (
            <div key={index} className="history-entry">
              <span className="delete-icon" title="מחיקת שאלון" onClick={() => handleDelete(entry.id)}>🗑️</span>
              <h2>{new Date(entry.timestamp.seconds * 1000).toLocaleDateString()}</h2>
              <p className="total-score">ציון כולל: {entry.totalScore}</p>
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
      )}
    </div>
  );
};

export default History;
