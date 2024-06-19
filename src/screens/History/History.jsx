import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const { user } = useAuthStatus();
  const [error, setError] = useState(null);
  const [trend, setTrend] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        try {
          const q = query(collection(db, 'QuestionnaireHistory'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const historyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          // Sort history data by timestamp
          historyData.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);

          setHistory(historyData);
          setError(null);

          // Calculate trend
          calculateTrend(historyData);
        } catch (error) {
          console.error('שגיאה באחזור ההיסטוריה: ', error);
          setError('שגיאה באחזור ההיסטוריה.');
          setHistory([]);
        }
      };

      fetchHistory();
    }
  }, [user]);

  useEffect(() => {
    calculateTrend(history);
  }, [history]);

  const calculateTrend = (data) => {
    if (data.length > 1) {
      const halfIndex = Math.floor(data.length / 2);
      const firstHalfScores = data.slice(0, halfIndex).map(entry => entry.totalScore);
      const secondHalfScores = data.slice(halfIndex).map(entry => entry.totalScore);

      const avgFirstHalf = firstHalfScores.reduce((acc, score) => acc + score, 0) / firstHalfScores.length;
      const avgSecondHalf = secondHalfScores.reduce((acc, score) => acc + score, 0) / secondHalfScores.length;

      if (avgSecondHalf > avgFirstHalf) {
        setTrend('המגמה עולה!');
      } else if (avgSecondHalf < avgFirstHalf) {
        setTrend('המגמה יורדת!');
      } else {
        setTrend('המגמה יציבה!');
      }
    } else {
      setTrend(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmation = window.confirm('האם אתה בטוח שברצונך למחוק את ההיסטוריה הזו?');
    if (confirmation) {
      try {
        await deleteDoc(doc(db, 'QuestionnaireHistory', id));
        setHistory(history.filter(item => item.id !== id));
      } catch (error) {
        console.error('שגיאה במחיקת ההיסטוריה: ', error);
        alert('שגיאה במחיקת ההיסטוריה.');
      }
    }
  };

  const graphData = {
    labels: history.map(entry => new Date(entry.timestamp.seconds * 1000).toLocaleDateString('he-IL')),
    datasets: [
      {
        label: 'ציון כולל',
        data: history.map(entry => entry.totalScore),
        backgroundColor: history.map(entry => entry.totalScore >= 10 ? 'rgba(255, 0, 0, 0.6)' :
          entry.totalScore >= 5 ? 'rgba(255, 255, 0, 0.6)' :
          'rgba(0, 128, 0, 0.6)'),
        borderColor: history.map(entry => entry.totalScore >= 10 ? 'rgba(255, 0, 0, 1)' :
          entry.totalScore >= 5 ? 'rgba(255, 255, 0, 1)' :
          'rgba(0, 128, 0, 1)'),
        borderWidth: 1,
      },
    ],
  };

  const graphOptions = {
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
        display: false, // Hide y-axis labels
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          generateLabels: (chart) => {
            const dataset = chart.data.datasets[0];
            return [
              {
                text: '0-4',
                fillStyle: 'rgba(0, 128, 0, 0.6)',
                strokeStyle: 'rgba(0, 128, 0, 1)',
                lineWidth: 1,
                hidden: false,
                index: 0,
              },
              {
                text: '5-9',
                fillStyle: 'rgba(255, 255, 0, 0.6)',
                strokeStyle: 'rgba(255, 255, 0, 1)',
                lineWidth: 1,
                hidden: false,
                index: 1,
              },
              {
                text: '10-15',
                fillStyle: 'rgba(255, 0, 0, 0.6)',
                strokeStyle: 'rgba(255, 0, 0, 1)',
                lineWidth: 1,
                hidden: false,
                index: 2,
              },
            ];
          },
        },
      },
      datalabels: {
        color: 'black',
        anchor: 'end',
        align: 'end',
        formatter: (value) => value,
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 80, // Add more space between the legend and the graph
      },
    },
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
        <>
          <div className="history-grid">
            {history.map((entry, index) => (
              <div key={index} className="history-entry">
                <span className="delete-icon" title="מחיקת שאלון" onClick={() => handleDelete(entry.id)}>🗑️</span>
                <h2>{new Date(entry.timestamp.seconds * 1000).toLocaleDateString('he-IL')}</h2>
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
          <div className="graph-container">
            <h2>התקדמות ציונים</h2>
            {trend && (
              <p className="trend-message" style={{ fontWeight: 'bold' }}>
                {trend}
              </p>
            )}
            <p className="graph-description">הגרף מציג את זמן מילוי השאלון לעומת הציון</p>
            <Bar data={graphData} options={graphOptions} />
          </div>
        </>
      )}
    </div>
  );
};

export default History;
