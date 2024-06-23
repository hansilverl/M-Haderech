import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Modal from 'react-modal';
import './Statistics.css';

Modal.setAppElement('#root');

const Statistics = () => {
  const [statistics, setStatistics] = useState({});
  const [tempStatistics, setTempStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const statsDoc = doc(db, 'miscellaneousUpdated', 'statistics');
        const statsSnapshot = await getDoc(statsDoc);
        if (statsSnapshot.exists()) {
          setStatistics(statsSnapshot.data());
        } else {
          setError('לא נמצאו סטטיסטיקות.');
        }
        setLoading(false);
      } catch (err) {
        setError('נכשל באחזור הסטטיסטיקות.');
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const openModal = () => {
    setTempStatistics({ ...statistics });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempStatistics((prevStats) => ({ ...prevStats, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const statsDoc = doc(db, 'miscellaneousUpdated', 'statistics');
      await updateDoc(statsDoc, tempStatistics);
      setStatistics(tempStatistics);
      closeModal();
      alert('הסטטיסטיקה עודכנה בהצלחה.');
    } catch (error) {
      alert('שגיאה בעדכון הסטטיסטיקה.');
    }
  };

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <div className="stat-item">
      <div className="stat-label">
        <p>מספר אמהות שעזרנו להן</p>
        <p>{statistics.helped_mothers_amount}</p>
      </div>
      <button className="update-button" onClick={openModal}>עדכן</button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        <h2>עדכון סטטיסטיקות</h2>
        <form>
          <div className="modal-field">
            <label>
              מספר אמהות שעזרנו להן:
              <input
                type="text"
                name="helped_mothers_amount"
                value={tempStatistics.helped_mothers_amount || ''}
                onChange={handleChange}
              />
            </label>
          </div>
        </form>
        <div className="modal-actions">
          <button onClick={handleSave}>שמור</button>
          <button onClick={closeModal}>בטל</button>
        </div>
      </Modal>
    </div>
  );
};

export default Statistics;
