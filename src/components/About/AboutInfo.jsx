// src/components/About/AboutInfo.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Modal from 'react-modal';
import './AboutInfo.css';

Modal.setAppElement('#root');

const AboutInfo = () => {
  const [aboutInfo, setAboutInfo] = useState('');
  const [tempAboutInfo, setTempAboutInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        const docRef = doc(db, 'miscellaneousUpdated', 'about'); 
        const aboutDoc = await getDoc(docRef);
        if (aboutDoc.exists()) {
          setAboutInfo(aboutDoc.data().about);
        } else {
          setError('לא נמצאה אינפורמציית אודות.');
        }
      } catch (err) {
        setError('נכשל בטעינת אינפורמציית אודות.');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutInfo();
  }, []);

  const openModal = () => {
    setTempAboutInfo(aboutInfo);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleChange = (e) => {
    setTempAboutInfo(e.target.value);
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'miscellaneousUpdated', 'about'); 
      await updateDoc(docRef, { about: tempAboutInfo });
      setAboutInfo(tempAboutInfo);
      closeModal();
      alert('אינפורמציית אודות עודכנה בהצלחה.');
    } catch (error) {
      alert('שגיאה בעדכון אינפורמציית אודות.');
    }
  };

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <div className="about-info">
      <div className="about-info-content">
        {/* <p>{aboutInfo}</p> */}
        <button className="update-button" onClick={openModal}>עדכן</button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        <h2>עדכון אינפורמציית אודות</h2>
        <form>
          <div className="modal-field">
            <label>
              <textarea
                value={tempAboutInfo}
                onChange={handleChange}
              />
            </label>
          </div>
        </form>
        <div className="modal-actions">
          <button onClick={handleSave}>שמירה</button>
          <button onClick={closeModal}>בטל</button>
        </div>
      </Modal>
    </div>
  );
};

export default AboutInfo;
