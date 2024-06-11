// src/hooks/useMiscellaneous.js
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const useMiscellaneous = (docId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'miscellaneous', docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          setError('No such document!');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [docId]);

  const updateData = async (newData) => {
    try {
      const docRef = doc(db, 'miscellaneous', docId);
      await updateDoc(docRef, newData);
      setData(newData);
    } catch (err) {
      console.error('Error updating document:', err);
      setError(err.message);
    }
  };

  return { data, loading, error, updateData };
};

export default useMiscellaneous;
