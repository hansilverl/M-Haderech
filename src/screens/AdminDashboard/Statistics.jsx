// src/screens/AdminDashboard/Statistics.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import './Statistics.css';

const Statistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const statsCollection = collection(db, 'statistics');
        const statsSnapshot = await getDocs(statsCollection);
        const statsList = statsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStatistics(statsList);
        setLoading(false);
      } catch (err) {
        setError('נכשל באחזור הסטטיסטיקות.');
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const handleUpdateStatistic = async (id, value) => {
    try {
      const statDoc = doc(db, 'statistics', id);
      await updateDoc(statDoc, { helped_mothers_amount: value });
      setStatistics(statistics.map(stat => stat.id === id ? { ...stat, helped_mothers_amount: value } : stat));
    } catch (error) {
      console.error('שגיאה בעדכון הסטטיסטיקה: ', error);
      setError('שגיאה בעדכון הסטטיסטיקה.');
    }
  };

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <div className="statistics">
      <h1>הסטטיסטיקות</h1>
      <div className="statistics-list">
        {statistics.map(stat => (
          <div key={stat.id} className="stat-item">
            <h2>מספר אמהות שעזרנו להן</h2>
            <div className="stat-label">{stat.helped_mothers_amount}</div>
            <button onClick={() => {
              const newValue = parseInt(prompt('הזן את הערך החדש:'), 10);
              if (!isNaN(newValue)) {
                handleUpdateStatistic(stat.id, newValue);
              }
            }}>עדכן</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics;
