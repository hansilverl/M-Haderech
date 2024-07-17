// src/pages/AdminDashboard/AboutFullAdmin.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Modal from 'react-modal';
import './AboutFullAdmin.css';

Modal.setAppElement('#root');

const AboutFullAdmin = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [text, setText] = useState('');
  const [additionalText, setAdditionalText] = useState('');
  const [tempTitle, setTempTitle] = useState('');
  const [tempSubtitle, setTempSubtitle] = useState('');
  const [tempText, setTempText] = useState('');
  const [tempAdditionalText, setTempAdditionalText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        const docRef = doc(db, 'miscellaneousUpdated', 'about_full');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setSubtitle(data.subtitle);
          setText(data.text);
          setAdditionalText(data.additionalText);
        } else {
          setError('לא נמצאה אינפורמציה עלינו.');
        }
      } catch (err) {
        setError('נכשל בטעינת אינפורמציה עלינו.');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutInfo();
  }, []);

  const openModal = () => {
    setTempTitle(title);
    setTempSubtitle(subtitle);
    setTempText(text);
    setTempAdditionalText(additionalText);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'miscellaneousUpdated', 'about_full');
      await updateDoc(docRef, {
        title: tempTitle,
        subtitle: tempSubtitle,
        text: tempText,
        additionalText: tempAdditionalText
      });
      setTitle(tempTitle);
      setSubtitle(tempSubtitle);
      setText(tempText);
      setAdditionalText(tempAdditionalText);
      closeModal();
      alert('מידע עודכן בהצלחה.');
    } catch (error) {
      alert('שגיאה בעדכון המידע.');
    }
  };

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <div className="admin-section">
      <div className="admin-content">
        {/* <p><strong>כותרת:</strong> {title}</p>
        <p><strong>תת כותרת:</strong> {subtitle}</p>
        <p><strong>טקסט:</strong> {text}</p>
        <p><strong>טקסט נוסף:</strong> {additionalText}</p> */}
        <button className="update-button" onClick={openModal}>עדכן</button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        <h2>עדכון אינפורמציה עלינו</h2>
        <form>
          <label>
            כותרת:
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
            />
          </label>
          <label>
            תת כותרת:
            <input
              type="text"
              value={tempSubtitle}
              onChange={(e) => setTempSubtitle(e.target.value)}
            />
          </label>
          <label>
            טקסט:
            <textarea
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
            />
          </label>
          <label>
            טקסט נוסף:
            <textarea
              value={tempAdditionalText}
              onChange={(e) => setTempAdditionalText(e.target.value)}
            />
          </label>
        </form>
        <div className="modal-actions">
          <button onClick={handleSave}>שמור</button>
          <button onClick={closeModal}>בטל</button>
        </div>
      </Modal>
    </div>
  );
};

export default AboutFullAdmin;
