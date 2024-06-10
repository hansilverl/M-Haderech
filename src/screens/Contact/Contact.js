// src/pages/Contact/Contact.js
import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

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
    </div>
  );
};

export default Contact;
