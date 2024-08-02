import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FaTimes } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faBars } from '@fortawesome/free-solid-svg-icons'
import './EditScoreDescModal.css';

const EditScoreDescModal = ({ isOpen, onRequestClose }) => {
  const [scoreRanges, setScoreRanges] = useState({
    '0-19': { title: '', desc: '' },
    '20-32': { title: '', desc: '' },
    '33+': { title: '', desc: '' }
  });

  useEffect(() => {
    const fetchScoreRanges = async () => {
      try {
        const ranges = ['0-19', '20-32', '33+'];
        const fetchedRanges = {};

        for (const range of ranges) {
          const docRef = doc(db, 'QuestionnaireRes', range);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            fetchedRanges[range] = docSnap.data();
          } else {
            fetchedRanges[range] = { title: '', desc: '' };
          }
        }

        setScoreRanges(fetchedRanges);
      } catch (error) {
        console.error('Error fetching score ranges:', error);
      }
    };

    if (isOpen) {
      fetchScoreRanges();
    }
  }, [isOpen]);

  const handleInputChange = (range, field, value) => {
    setScoreRanges(prev => ({
      ...prev,
      [range]: { ...prev[range], [field]: value }
    }));
  };

  const handleSave = async () => {
    try {
      for (const [range, data] of Object.entries(scoreRanges)) {
        const docRef = doc(db, 'QuestionnaireRes', range);
        await updateDoc(docRef, data);
      }
      alert('התיאורים עודכנו בהצלחה!');
      onRequestClose();
    } catch (error) {
      console.error('Error updating score ranges:', error);
      alert('אירעה שגיאה בעדכון התיאורים.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Score Descriptions"
      className="ESDModal"
      overlayClassName="ESDOverlay"
    >
      <div className="esd-modal-content">
        <button className="close-button" onClick={onRequestClose}>
          <FaTimes />
        </button>
        <h2 className="esd-title">עריכת תיאורי תוצאות המבדק</h2>
        <div className="esd-content">
          {Object.entries(scoreRanges).map(([range, data]) => (
            <div key={range} className="esd-range-section">
              <h3 className="esd-range-title">טווח: {range}</h3>
              <div className="esd-input-group">
                <label htmlFor={`title-${range}`}>כותרת:</label>
                <input
                  type="text"
                  id={`title-${range}`}
                  value={data.title || ''}
                  onChange={(e) => handleInputChange(range, 'title', e.target.value)}
                  className="esd-input"
                />
              </div>
              <div className="esd-input-group">
                <label htmlFor={`desc-${range}`}>תיאור:</label>
                <textarea
                  id={`desc-${range}`}
                  value={data.desc || ''}
                  onChange={(e) => handleInputChange(range, 'desc', e.target.value)}
                  className="esd-textarea"
                  rows="4"
                />
              </div>
            </div>
          ))}
        </div>
        <button className="save-button" onClick={handleSave}>
                  שמירת שינויים
                  {' '}
                  <FontAwesomeIcon icon={faFloppyDisk} />

        </button>
      </div>
    </Modal>
  );
};

export default EditScoreDescModal;