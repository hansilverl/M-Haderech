// src/components/NewsletterLink/NewsletterLinkAdmin.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Modal from 'react-modal';
import './NewsletterLinkAdmin.css';

Modal.setAppElement('#root');

const NewsletterLinkAdmin = () => {
  const [newsletterLink, setNewsletterLink] = useState('');
  const [tempNewsletterLink, setTempNewsletterLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchNewsletterLink = async () => {
      try {
        const docRef = doc(db, 'miscellaneousUpdated', 'newsletter');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNewsletterLink(docSnap.data().newsletter);
        } else {
          setError('לא נמצא קישור לרשימת תפוצה.');
        }
      } catch (err) {
        setError('נכשל בטעינת קישור לרשימת תפוצה.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletterLink();
  }, []);

  const openModal = () => {
    setTempNewsletterLink(newsletterLink);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleChange = (e) => {
    setTempNewsletterLink(e.target.value);
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'miscellaneousUpdated', 'newsletter');
      await updateDoc(docRef, {
        newsletter: tempNewsletterLink
      });
      setNewsletterLink(tempNewsletterLink);
      closeModal();
      alert('קישור לרשימת תפוצה עודכן בהצלחה.');
    } catch (error) {
      alert('שגיאה בעדכון קישור לרשימת תפוצה.');
    }
  };

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <div className="newsletter-link">
      <div className="newsletter-link-content">
        <p><strong>קישור לרשימת תפוצה:</strong> {newsletterLink}</p>
        <button className="update-button" onClick={openModal}>עדכן</button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        <h2>עדכון קישור לרשימת תפוצה</h2>
        <form>
          <div className="modal-field">
            <label>
              קישור:
              <input
                type="text"
                value={tempNewsletterLink}
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

export default NewsletterLinkAdmin;
