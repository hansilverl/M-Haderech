import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Modal from 'react-modal';
import './Contact.css';

Modal.setAppElement('#root');

const Contact = () => {
  const [contactInfo, setContactInfo] = useState({});
  const [tempContactInfo, setTempContactInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const docRef = doc(db, 'miscellaneousUpdated', 'contact');
        const contactDoc = await getDoc(docRef);
        if (contactDoc.exists()) {
          setContactInfo(contactDoc.data());
        } else {
          setError('לא נמצאה אינפורמציית קשר.');
        }
      } catch (err) {
        setError('נכשל בטעינת אינפורמציית קשר.');
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const openModal = () => {
    setTempContactInfo({ ...contactInfo });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempContactInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'miscellaneousUpdated', 'contact');
      await updateDoc(docRef, tempContactInfo);
      setContactInfo(tempContactInfo);
      closeModal();
      alert('אינפורמציית קשר עודכנה בהצלחה.');
    } catch (error) {
      alert('שגיאה בעדכון אינפורמציית קשר.');
    }
  };

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <div className="contact-info">
      <div className="contact-info-content">
        {contactInfo && (
          <div>
            {Object.entries(contactInfo).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
          </div>
        )}
        <button className="update-button" onClick={openModal}>עדכן</button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        <h2>עדכון פרטי קשר</h2>
        <form>
          {tempContactInfo && Object.entries(tempContactInfo).map(([key, value]) => (
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
            </div>
          ))}
        </form>
        <div className="modal-actions">
          <button onClick={handleSave}>שמור</button>
          <button onClick={closeModal}>בטל</button>
        </div>
      </Modal>
    </div>
  );
};

export default Contact;
