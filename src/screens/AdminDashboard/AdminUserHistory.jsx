import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { CSVLink } from 'react-csv';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chartjs-plugin-datalabels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import './AdminUserHistory.css';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Adjust this selector to your app's root element

const AdminUserHistory = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answerStats, setAnswerStats] = useState({});
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchAnswers = async () => {
      const answersData = {};
      const questionsSnapshot = await getDocs(collection(db, 'Questionnaire'));
      questionsSnapshot.forEach(doc => {
        answersData[doc.id] = doc.data();
      });
      setAnswers(answersData);
    };

    fetchAnswers();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        let q = collection(db, 'QuestionnaireHistory');
        const conditions = [];
        if (startDate !== '') {
          conditions.push(where('timestamp', '>=', new Date(startDate)));
        }
        if (endDate !== '') {
          conditions.push(where('timestamp', '<=', new Date(endDate)));
        }

        q = query(q, ...conditions);

        const querySnapshot = await getDocs(q);
        const historyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        historyData.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds); // Sort by timestamp from newest to oldest
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
  }, [startDate, endDate]);

  const calculateAnswerStats = (historyData) => {
    const stats = {};
    historyData.forEach(entry => {
      entry.responses.forEach(response => {
        if (!stats[response.question]) {
          stats[response.question] = {};
        }
        const answerText = answers[response.question] ? answers[response.question][response.selectedOption] : response.selectedOption;
        if (!stats[response.question][answerText]) {
          stats[response.question][answerText] = 0;
        }
        stats[response.question][answerText]++;
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
        <label className="date-label">תאריך התחלה:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="search-input"
        />
        <label className="date-label">תאריך סיום (לא כולל):</label>
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
      <p>סה"כ רשומות היסטוריה: {history.length}</p>
      <div className="statistics-container">
        <h2>סטטיסטיקות של שאלות (לפי תאריכים נבחרים):</h2>
        {Object.keys(answerStats).map(question => {
          const data = {
            labels: Object.keys(answerStats[question]),
            datasets: [
              {
                data: Object.values(answerStats[question]),
                backgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#9966FF',
                  '#FF9F40',
                ],
              },
            ],
          };
          const options = {
            plugins: {
              legend: {
                display: true,
                position: 'right',
                labels: {
                  usePointStyle: true,
                  generateLabels: (chart) => {
                    const dataset = chart.data.datasets[0];
                    return chart.data.labels.map((label, i) => ({
                      text: `תשובה מספר ${i + 1} כמות הצבעות ${dataset.data[i]}`,
                      fillStyle: dataset.backgroundColor[i],
                      hidden: false,
                      index: i,
                    }));
                  },
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.label || '';
                    const value = context.raw || '';
                    return `תשובה: ${label}, כמות הצבעות: ${value}`;
                  },
                },
              },
              datalabels: {
                display: false,
              },
            },
            maintainAspectRatio: false,
            responsive: true,
            layout: {
              padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
              },
            },
          };
          return (
            <div key={question} className="question-stats-box">
              <h3>{question}</h3>
              <div className="chart-container">
                <div className="pie-chart-container">
                  <Pie data={data} options={options} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="history-grid">
        {history.map((entry, index) => (
          <div key={index} className="history-entry">
            <h2>תאריך: {new Date(entry.timestamp.seconds * 1000).toLocaleDateString('he-IL')}</h2>
            <p className="total-score">ציון כולל: {entry.totalScore}</p>
            <span
              className="icon"
              onClick={() => openModal(entry)}
            >
              <FontAwesomeIcon icon={faEye} />
            </span>
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
                  <p><strong>תשובה נבחרה:</strong> {response.score}</p>
                  <p><strong>ציון:</strong> {response.selectedOption}</p>
                </div>
              ))}
            </div>
            <button onClick={closeModal} className="modal-close-button">סגור</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUserHistory;
