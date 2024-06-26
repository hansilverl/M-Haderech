import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import Modal from 'react-modal';
import { FaTrashAlt } from 'react-icons/fa';
import './Contact.css';

Modal.setAppElement('#root');

const Contact = () => {
  const [contactInfo, setContactInfo] = useState({});
  const [tempContactInfo, setTempContactInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteConfirmIsOpen, setDeleteConfirmIsOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState(null);
  const [newField, setNewField] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

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

  const handleAddField = () => {
    if (newField && newFieldValue) {
      setTempContactInfo((prevInfo) => ({ ...prevInfo, [newField]: newFieldValue }));
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
      const updatedTempContactInfo = { ...tempContactInfo };
      delete updatedTempContactInfo[fieldToDelete];
      setTempContactInfo(updatedTempContactInfo);

      const docRef = doc(db, 'miscellaneousUpdated', 'contact');
      await updateDoc(docRef, {
        [fieldToDelete]: deleteField()
      });

      setDeleteConfirmIsOpen(false);
      setFieldToDelete(null);
      setContactInfo(updatedTempContactInfo);
      alert('השדה נמחק בהצלחה.');
    } catch (error) {
      alert('שגיאה במחיקת השדה.');
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
            />
            <input
              type="text"
              placeholder="תוכן השדה"
              value={newFieldValue}
              onChange={(e) => setNewFieldValue(e.target.value)}
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

export default Contact;
