import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import './Contact.css';

const Contact = () => {
  const [user_name, setName] = useState('');
  const [user_email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [contactInfo, setContactInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ visible: false, message: '' });

  const form = useRef();

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

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_6ookygf', 'template_srcbp0v', form.current, 'twD4H2uyQGkEbZmZ-')
      .then(
        () => {
          setModal({ visible: true, message: 'ההודעה נשלחה בהצלחה!' });
          setName('');
          setEmail('');
          setMessage('');
        },
        (error) => {
          setModal({ visible: true, message: 'שליחת ההודעה נכשלה, נסה שוב מאוחר יותר.' });
          console.error('FAILED...', error.text);
        },
      );

    setTimeout(() => setModal({ visible: false, message: '' }), 5000);
  };

  return (
    <div className="contact-container">
      <h2>צור קשר</h2>
      <form ref={form} className="contact-form" onSubmit={sendEmail}>
        <label>
          <span>שם:</span>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={user_name}
            name="user_name"
          />
        </label>
        <label>
          <span>אימייל:</span>
          <input
            required
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={user_email}
            name="user_email"
          />
        </label>
        <label>
          <span>תוכן הודעה:</span>
          <textarea
            required
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            name="message"
          />
        </label>
        <button type="submit">שליחה</button>
      </form>
      {loading ? (
        <p>טוען...</p>
      ) : error ? (
        <p>שגיאה: {error}</p>
      ) : (
        <div className="contact-info">
          <h3>פרטי קשר:</h3>
          {Object.entries(contactInfo).map(([key, value]) => (
            <p key={key}><strong>{key}:</strong> {value}</p>
          ))}
        </div>
      )}
      {modal.visible && (
        <div className="modal">
          <p>{modal.message}</p>
        </div>
      )}
    </div>
  );
};

export default Contact;
