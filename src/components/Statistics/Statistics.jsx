import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import Modal from 'react-modal';
import { FaTrashAlt } from 'react-icons/fa';
import './Statistics.css';

Modal.setAppElement('#root');

const Statistics = () => {
  const [statistics, setStatistics] = useState({});
  const [tempStatistics, setTempStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteConfirmIsOpen, setDeleteConfirmIsOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState(null);
  const [newField, setNewField] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

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

  const handleAddField = () => {
    if (newField && newFieldValue) {
      setTempStatistics((prevStats) => ({ ...prevStats, [newField]: newFieldValue }));
      setNewField('');
      setNewFieldValue('');
    }
  };

  const handleDeleteField = (fieldKey) => {
    setFieldToDelete(fieldKey);
    setDeleteConfirmIsOpen(true);
  };

  const confirmDeleteField = async () => {
    try {
      const updatedTempStatistics = { ...tempStatistics };
      delete updatedTempStatistics[fieldToDelete];
      setTempStatistics(updatedTempStatistics);

      const statsDoc = doc(db, 'miscellaneousUpdated', 'statistics');
      await updateDoc(statsDoc, {
        [fieldToDelete]: deleteField()
      });

      setDeleteConfirmIsOpen(false);
      setFieldToDelete(null);
      setStatistics(updatedTempStatistics);
      alert('השדה נמחק בהצלחה.');
    } catch (error) {
      alert('שגיאה במחיקת השדה.');
    }
  };

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <div className="stat-item">
      <div className="stat-label">
        {statistics && Object.entries(statistics).map(([key, value]) => (
          <div key={key} className="stat-field">
            <p><strong>{key}:</strong> {value}</p>
          </div>
        ))}
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
          {tempStatistics && Object.entries(tempStatistics).map(([key, value]) => (
            <div key={key} className="modal-field">
              <label>
                {key}:
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleChange}
                />
              </label>
              <FaTrashAlt className="delete-icon" onClick={() => handleDeleteField(key)} />
            </div>
          ))}
          <div className="new-field">
            <h3>הוסף שדה חדש</h3>
            <input
              type="text"
              placeholder="שם השדה"
              value={newField}
              onChange={(e) => setNewField(e.target.value)}
              className="wide-input"
            />
            <input
              type="text"
              placeholder="תוכן השדה"
              value={newFieldValue}
              onChange={(e) => setNewFieldValue(e.target.value)}
              className="wide-input"
            />
            <div className="add-field-button">
              <button type="button" onClick={handleAddField}>הוסף שדה</button>
            </div>
          </div>
        </form>
        <div className="modal-actions">
          <button onClick={handleSave}>שמור</button>
          <button onClick={closeModal}>בטל</button>
        </div>
      </Modal>

      <Modal
        isOpen={deleteConfirmIsOpen}
        onRequestClose={() => setDeleteConfirmIsOpen(false)}
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        <h2>אישור מחיקה</h2>
        <p>האם אתה בטוח שברצונך למחוק את השדה הזה?</p>
        <div className="modal-actions">
          <button onClick={confirmDeleteField}>מחק</button>
          <button onClick={() => setDeleteConfirmIsOpen(false)}>בטל</button>
        </div>
      </Modal>
    </div>
  );
};

export default Statistics;
