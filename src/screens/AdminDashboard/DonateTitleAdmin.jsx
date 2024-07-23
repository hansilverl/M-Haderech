// src/components/DonateTitleAdmin/DonateTitleAdmin.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Modal from 'react-modal';
import './DonateTitleAdmin.css';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

Modal.setAppElement('#root');

const DonateTitleAdmin = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [tempTitle, setTempTitle] = useState('');
  const [tempSubtitle, setTempSubtitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchTitleAndSubtitle = async () => {
      try {
        const docRef = doc(db, 'miscellaneousUpdated', 'donate_title');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTitle(docSnap.data().title);
          setSubtitle(docSnap.data().subtitle);
        } else {
          setError('לא נמצא כותרת לעמוד תרומה.');
        }
      } catch (err) {
        setError('נכשל בטעינת כותרת לעמוד תרומה.');
      } finally {
        setLoading(false);
      }
    };

    fetchTitleAndSubtitle();
  }, []);

  const openModal = () => {
    setTempTitle(title);
    setTempSubtitle(subtitle);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleChangeTitle = (e) => {
    setTempTitle(e.target.value);
  };

  const handleChangeSubtitle = (e) => {
    setTempSubtitle(e.target.value);
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'miscellaneousUpdated', 'donate_title');
      await updateDoc(docRef, {
        title: tempTitle,
        subtitle: tempSubtitle,
      });
      setTitle(tempTitle);
      setSubtitle(tempSubtitle);
      closeModal();
      alert('כותרת ותת כותרת עודכנו בהצלחה.');
    } catch (error) {
      alert('שגיאה בעדכון כותרת ותת כותרת.');
    }
  };

  if (loading) return <LoadingSpinner />
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <div className="donate-title-admin">
      <div className="donate-title-admin-content">
        {/* <p><strong>כותרת:</strong> {title}</p>
        <p><strong>תת כותרת:</strong> {subtitle}</p> */}
        <button className="update-button" onClick={openModal}>עדכן</button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        <h2>עדכון כותרת ותת כותרת</h2>
        <form>
          <div className="modal-field">
            <label>
              כותרת:
              <input
                type="text"
                value={tempTitle}
                onChange={handleChangeTitle}
              />
            </label>
          </div>
          <div className="modal-field">
            <label>
              תת כותרת:
              <input
                type="text"
                value={tempSubtitle}
                onChange={handleChangeSubtitle}
              />
            </label>
          </div>
        </form>
        <div className="modal-actions">
          <button className="save-changes"
           onClick={handleSave}>שמירה</button>
          <button onClick={closeModal}>בטל</button>
        </div>
      </Modal>
    </div>
  );
};

export default DonateTitleAdmin;
