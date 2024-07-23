// src/components/DonationNumber/DonationNumber.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Modal from 'react-modal';
import { FaPhone } from 'react-icons/fa';
import './DonationNumber.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

Modal.setAppElement('#root');

const DonationNumber = () => {
  const [donationNumber, setDonationNumber] = useState('');
  const [tempDonationNumber, setTempDonationNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchDonationNumber = async () => {
      try {
        const docRef = doc(db, 'miscellaneousUpdated', 'donate_number');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDonationNumber(docSnap.data().number);
        } else {
          setError('לא נמצא מספר תרומה.');
        }
      } catch (err) {
        setError('נכשל בטעינת מספר תרומה.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonationNumber();
  }, []);

  const openModal = () => {
    setTempDonationNumber(donationNumber);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleChange = (e) => {
    setTempDonationNumber(e.target.value);
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'miscellaneousUpdated', 'donate_number');
      await updateDoc(docRef, { number: tempDonationNumber });
      setDonationNumber(tempDonationNumber);
      closeModal();
      alert('מספר תרומה עודכן בהצלחה.');
    } catch (error) {
      alert('שגיאה בעדכון מספר תרומה.');
    }
  };

  if (loading) return <LoadingSpinner />
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <div className="donation-number">
      <div className="donation-number-content">
        <button className="update-button" onClick={openModal}>עדכן</button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        <h2>עדכון מספר תרומה</h2>
        <form>
          <div className="modal-field">
            <label>
              מספר:
              <input
                type="text"
                value={tempDonationNumber}
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

export default DonationNumber;
