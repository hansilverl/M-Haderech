// src/components/DonationLink/DonationLink.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Modal from 'react-modal';
import './DonationLink.css';

Modal.setAppElement('#root');

const DonationLink = () => {
  const [donationLink, setDonationLink] = useState('');
  const [tempDonationLink, setTempDonationLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchDonationLink = async () => {
      try {
        const docRef = doc(db, 'miscellaneousUpdated', 'donate_link');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDonationLink(docSnap.data().link);
        } else {
          setError('לא נמצא קישור תרומה.');
        }
      } catch (err) {
        setError('נכשל בטעינת קישור תרומה.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonationLink();
  }, []);

  const openModal = () => {
    setTempDonationLink(donationLink);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleChange = (e) => {
    setTempDonationLink(e.target.value);
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'miscellaneousUpdated', 'donate_link');
      await updateDoc(docRef, { link: tempDonationLink });
      setDonationLink(tempDonationLink);
      closeModal();
      alert('קישור תרומה עודכן בהצלחה.');
    } catch (error) {
      alert('שגיאה בעדכון קישור תרומה.');
    }
  };

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <div className="donation-link">
      <div className="donation-link-content">
        <p><strong>קישור תרומה:</strong> {donationLink}</p>
        <button className="update-button" onClick={openModal}>עדכן</button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        <h2>עדכון קישור תרומה</h2>
        <form>
          <div className="modal-field">
            <label>
              קישור:
              <input
                type="text"
                value={tempDonationLink}
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

export default DonationLink;
