// src/hooks/useStatistics.js
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const useStatistics = () => {
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
        console.error('Error fetching statistics:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const updateStatistic = async (statId, updatedData) => {
    try {
      const statDoc = doc(db, 'statistics', statId);
      await updateDoc(statDoc, updatedData);
      setStatistics(statistics.map(stat => (stat.id === statId ? { ...stat, ...updatedData } : stat)));
    } catch (err) {
      console.error('Error updating statistic:', err);
      setError(err.message);
    }
  };

  return { statistics, loading, error, updateStatistic };
};

export default useStatistics;
