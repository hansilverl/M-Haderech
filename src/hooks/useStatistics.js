// src/hooks/useStatistics.js
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const useStatistics = () => {
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const statDoc = doc(db, 'miscellaneousUpdated', 'statistics');
        const statSnapshot = await getDoc(statDoc);
        if (statSnapshot.exists()) {
          setStatistics({ id: statSnapshot.id, ...statSnapshot.data() });
        } else {
          setError('No statistics found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const updateStatistic = async (updatedData) => {
    try {
      const statDoc = doc(db, 'miscellaneousUpdated', 'statistics');
      await updateDoc(statDoc, updatedData);
      setStatistics(prevStats => ({ ...prevStats, ...updatedData }));
    } catch (err) {
      console.error('Error updating statistic:', err);
      setError(err.message);
    }
  };

  return { statistics, loading, error, updateStatistic };
};

export default useStatistics;
