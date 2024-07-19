import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const { user } = useAuthStatus();
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0 });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        try {
          let q = query(collection(db, 'QuestionnaireHistory'), where('userId', '==', user.uid));
          if (startDate !== '' && endDate !== '') {
            q = query(q, where('timestamp', '>=', new Date(startDate)), where('timestamp', '<=', new Date(endDate)));
          } else if (startDate !== '') {
            q = query(q, where('timestamp', '>=', new Date(startDate)));
          } else if (endDate !== '') {
            q = query(q, where('timestamp', '<=', new Date(endDate)));
          }

          const querySnapshot = await getDocs(q);
          const historyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          // Sort history data by timestamp for graph (oldest to newest)
          const sortedHistoryData = [...historyData].sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);

          // Set history data sorted by timestamp (newest to oldest) for display
          const displayHistoryData = [...historyData].sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

          setHistory(displayHistoryData);
          setError(null);
        } catch (error) {
          console.error('שגיאה באחזור ההיסטוריה: ', error);
          setError('שגיאה באחזור ההיסטוריה.');
          setHistory([]);
        }
      };

      fetchHistory();
    }
  }, [user, startDate, endDate]);

  const confirmDelete = async () => {
    if (entryToDelete) {
      try {
        await deleteDoc(doc(db, 'QuestionnaireHistory', entryToDelete.id));
        setHistory(history.filter(item => item.id !== entryToDelete.id));
        closeDeleteModal();
      } catch (error) {
        console.error('שגיאה במחיקת ההיסטוריה: ', error);
        alert('שגיאה במחיקת ההיסטוריה.');
      }
    }
  };

  const handleDelete = (entry) => {
    setEntryToDelete(entry);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setEntryToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const openModal = (entry) => {
    setSelectedEntry(entry);
  };

  const closeModal = () => {
    setSelectedEntry(null);
  };

  const graphData = {
    labels: history.map(entry => new Date(entry.timestamp.seconds * 1000).toLocaleDateString('he-IL')).reverse(),
    datasets: [
      {
        label: 'ציון כולל',
        data: history.map(entry => entry.totalScore).reverse(),
        backgroundColor: history.map(entry => entry.totalScore >= 33 ? '#A4303F' :
          entry.totalScore >= 20 ? '#F2CD60' :
            '#2D936C').reverse(),
        borderColor: history.map(entry => entry.totalScore >= 33 ? '#A4303F' :
          entry.totalScore >= 20 ? '#F2CD60' :
            '#2D936C').reverse(),
        borderWidth: 1,
        categoryPercentage: 0.99,
        barPercentage: 0.99,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: true,
    onClick: (e, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        openModal(history[history.length - 1 - index]);
      }
    },
    scales: {
      x: {
        type: 'category',
        barPercentage: 1.0,
        categoryPercentage: 1.0,
        title: {
          display: true,
          text: 'זמן מילוי השאלון',
          font: {
            size: 16,
            weight: 'bold',
          },
        },
      },
      y: {
        beginAtZero: true,
        display: true, // Show y-axis labels
        title: {
          display: true,
          text: 'ניקוד',
          font: {
            size: 16,
            weight: 'bold',
          },
          padding: { bottom: 20 }, // Add some padding for the rotation
          rotation: 270,
        },
        ticks: {
          display: false, // Hide y-axis ticks
        },
        grid: {
          display: false, // Hide background grid
        },
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
                text: '0-19',
                fillStyle: '#2D936C',
                strokeStyle: '#2D936C', // Border color for the legend item
                lineWidth: 1, // Border width for the legend item
                hidden: false,
                index: 0,
              },
              {
                text: '20-32',  // medium score
                fillStyle: '#F2CD60',
                strokeStyle: '#F2CD60',
                lineWidth: 1,
                hidden: false,
                index: 1,
              },
              {
                text: '33-60',  // high score
                fillStyle: '#A4303F',
                strokeStyle: '#A4303F',
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

  const handleMouseEnter = (e) => {
    const x = e.clientX + 10;
    const y = e.clientY + 10;
    setTooltip({ show: true, x, y });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0 });
  };

  return (
    <div className="history-container">
      <div className="graph-container">
        <h2>היסטוריית ההיפרמאזיס שלך
        </h2>
        <p className="graph-description">
          הגרף מציג את כל הנתונים על מצב ההיפרמאזיס שלך
          לפי זמן מילוי המבדק והניקוד האישי שלך.
        </p>
        <div className="graph-background">
          <Bar data={graphData} options={graphOptions} />        </div>
      </div>
      <h1>היסטוריה של השאלונים שלי</h1>
      <div className="filter-container">
        <label className="filter-start-date">תאריך התחלה:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="search-input"
        />
        <label className="filter-end-date">תאריך סיום:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="search-input"
        />
      </div>
      {error && <p className="error-no-history">{error}</p>}
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
                <span className="delete-icon" title="מחיקת שאלון" onClick={() => handleDelete(entry)}>
                  <FontAwesomeIcon icon={faTrashAlt} className="delete-icon-history" />
                </span>
                <h2>{new Date(entry.timestamp.seconds * 1000).toLocaleDateString('he-IL')}</h2>
                <p className="total-score">ציון כולל: {entry.totalScore}</p>
                <span
                  className="toggle-responses-icon"
                  onClick={() => openModal(entry)}
                  onMouseEnter={handleMouseEnter}
                  onMouseMove={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <FontAwesomeIcon icon={faEye} />
                </span>
              </div>
            ))}
          </div>
          {selectedEntry && (
            <Modal
              isOpen={!!selectedEntry}
              onRequestClose={closeModal}
              contentLabel="Responses Modal"
              className="responses-modal"
              overlayClassName="responses-overlay"
            >
              <h2>תשובות לשאלון מ- {new Date(selectedEntry.timestamp.seconds * 1000).toLocaleDateString('he-IL')}</h2>
              <div className="response-list">
                {selectedEntry.responses.map((response, idx) => (
                  <div key={idx} className="response-item">
                    <strong>שאלה:</strong> {response.question}<br />
                    <strong>תשובה נבחרה:</strong> {response.score}<br />
                    <strong>ציון:</strong> {response.selectedOption}
                  </div>
                ))}
              </div>
              <button onClick={closeModal} className="close-modal-button">סגור</button>
            </Modal>
          )}
          {isDeleteModalOpen && (
            <Modal
              isOpen={isDeleteModalOpen}
              onRequestClose={closeDeleteModal}
              contentLabel="Confirm Delete Modal"
              className="responses-modal"
              overlayClassName="responses-overlay"
            >
              <h2>אישור מחיקה</h2>
              <p>האם את בטוחה שברצונך למחוק את ההיסטוריה הזו?</p>
              <div className="confirmation-modal-buttons">
                <button onClick={confirmDelete} className="confirm-button">אישור</button>
                <button onClick={closeDeleteModal} className="cancel-button">ביטול</button>
              </div>
            </Modal>
          )}
          {tooltip.show && (
            <div className="custom-tooltip" style={{ top: tooltip.y, left: tooltip.x }}>
              צפייה בתשובות
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default History;