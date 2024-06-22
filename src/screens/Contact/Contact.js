import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import './Contact.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [contactInfo, setContactInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Handle form submission logic here
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
  };

  return (
    <div className="contact-container">
      <h2>צור קשר</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          <span>שם:</span>
          <input
            required
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label>
          <span>אימייל:</span>
          <input
            required
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label>
          <span>תוכן הודעה:</span>
          <textarea
            required
            onChange={(e) => setMessage(e.target.value)}
            value={message}
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
    </div>
  );
};

export default Contact;
