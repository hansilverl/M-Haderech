// src/components/LoginPopup/LoginPopup.js

import React, { useState, useEffect } from 'react';
import './LoginPopup.css';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import { useSignup } from '../../hooks/useSignup';
import { auth } from '../../firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useFirebaseErrorTranslation } from '../../hooks/useFirebaseErrorTranslation'; // Import the custom hook
import crossButton from '../../assets/cross_icon.png'; // Adjust the path as needed
import Modal from 'react-modal';

export const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("התחברות");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { error: loginError, login } = useLogin();
  const { error: signupError, signup } = useSignup();
  const [authError, setAuthError] = useState(null);
  const translateErrorToHebrew = useFirebaseErrorTranslation(); // Use the custom hook
  const navigate = useNavigate();

  useEffect(() => {
    if (loginError) {
      setAuthError(translateErrorToHebrew(loginError));
    } else if (signupError) {
      setAuthError(translateErrorToHebrew(signupError));
    }
  }, [loginError, signupError, translateErrorToHebrew]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, navigate);
      setShowLogin(false); 
    } catch (error) {
      setAuthError(translateErrorToHebrew(error.code));
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, navigate, true);
      setShowLogin(false); 
    } catch (error) {
      setAuthError(translateErrorToHebrew(error.code));
    }
  };

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        alert("אימייל לאיפוס סיסמה נשלח אליך.");
        setModalIsOpen(false);
      })
      .catch((error) => {
        console.error("Error object:", error); // Log the entire error object for debugging
        alert("אירעה שגיאה בשליחת האימייל: " + translateErrorToHebrew(error.code));
      });
  };

  return (
    <div className='login-popup'>
      <form action="" className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={crossButton} alt='close' />
        </div>
        <div className="login-popup-input">
          <input
            required
            type="email"
            placeholder="האימייל שלך"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            required
            type="password"
            placeholder="סיסמה"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button onClick={currState === "הרשמה" ? handleSignupSubmit : handleLoginSubmit}>
          {currState === "הרשמה" ? "צור חשבון" : "התחברות"}
        </button>
        {authError && <p>{authError}</p>}
        {currState === "התחברות" ? (
          <>
            <a className="reset-password-link" onClick={() => setModalIsOpen(true)}>איפוס סיסמה</a>
            <p>אין לך חשבון? <span onClick={() => setCurrState("הרשמה")}>לחץ כאן</span></p>
          </>
        ) : (
          <p>כבר יש לך חשבון? <span onClick={() => setCurrState("התחברות")}>התחבר כאן</span></p>
        )}
      </form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>איפוס סיסמה</h2>
        <label>
          <span>אימייל:</span>
          <input
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
        </label>
        <button onClick={handleResetPassword}>שלח אימייל לאיפוס סיסמה</button>
        <button onClick={() => setModalIsOpen(false)}>סגור</button>
      </Modal>
    </div>
  );
};
