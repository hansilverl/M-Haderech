import React, { useState, useEffect } from 'react';
import './LoginPopup.css';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import { useSignup } from '../../hooks/useSignup';
import { auth } from '../../firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import useFirebaseErrorTranslation from '../../hooks/useFirebaseErrorTranslation';
import crossButton from '../../assets/cross_icon.png';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const emailDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'];

export const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("התחברות");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const { error: loginError, login } = useLogin();
  const { error: signupError, signup } = useSignup();
  const [authError, setAuthError] = useState(null);
  const translateErrorToHebrew = useFirebaseErrorTranslation();
  const navigate = useNavigate();

  // Reset authError when switching between login and signup mode
  useEffect(() => {
    setAuthError(null);
  }, [currState]);

  useEffect(() => {
    if (loginError || signupError) {
      const error = loginError ? loginError : signupError;
      setAuthError(translateErrorToHebrew(error));
    }
  }, [loginError, signupError, translateErrorToHebrew]);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value.includes('@')) {
      const [localPart, domainPart] = value.split('@');
      if (domainPart) {
        setEmailSuggestions(emailDomains.filter(domain => domain.startsWith(domainPart)));
      } else {
        setEmailSuggestions(emailDomains);
      }
    } else {
      setEmailSuggestions([]);
    }
  };

  const handleEmailSelect = (suggestion) => {
    setEmail(email.split('@')[0] + '@' + suggestion);
    setEmailSuggestions([]);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, navigate);
      setAuthError(null);
      setShowLogin(false); // Close the modal only if login is successful
    } catch (error) {
      setAuthError(translateErrorToHebrew(error.code));
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signup(email, password, navigate, true);
      setAuthError(null);
      if (result) {
        setShowLogin(false); // Close the modal only if signup is successful
      }
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
        console.error("Error object:", error);
        alert("אירעה שגיאה בשליחת האימייל: " + translateErrorToHebrew(error.code));
      });
  };

  return (
    <div className='login-popup'>
      <form className="login-popup-container" onSubmit={currState === "הרשמה" ? handleSignupSubmit : handleLoginSubmit}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={crossButton} alt='close' />
        </div>
        <div className="login-popup-input">
          <input
            required
            type="email"
            name="email"
            placeholder="האימייל שלך"
            onChange={handleEmailChange}
            value={email}
          />
          {emailSuggestions.length > 0 && (
            <ul className="email-suggestions">
              {emailSuggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleEmailSelect(suggestion)}>
                  {email.split('@')[0]}@{suggestion}
                </li>
              ))}
            </ul>
          )}
          <input
            required
            type="password"
            name="password"
            placeholder="סיסמה"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button type="submit">
          {currState === "הרשמה" ? "צור חשבון" : "התחברות"}
        </button>
        {authError && <p className="error-message">{authError}</p>}
        {currState === "התחברות" ? (
          <>
            <a className="reset-password-link" onClick={() => setModalIsOpen(true)}>איפוס סיסמה</a>
            <p className='switcher' >אין לך חשבון? <span onClick={() => setCurrState("הרשמה")}>לחץ כאן</span></p>
          </>
        ) : (
          <p className='switcher'>כבר יש לך חשבון? <span onClick={() => setCurrState("התחברות")}>התחבר כאן</span></p>
        )}
      </form>

      <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          className="modal-password"
          overlayClassName="modal-overlay"
          parentSelector={() => document.querySelector('.login-popup')}
        >
          <div className="modal-password-header">
            <h2>איפוס סיסמה</h2>
            <img onClick={() => setModalIsOpen(false)} src={crossButton} alt='close' />
          </div>
          <div className="modal-password-body">
            <label>
              <span>אימייל:</span>
              <input
                type="email"
                name="resetEmail"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </label>
            <div className="reset-password-buttons">
              <button onClick={handleResetPassword}>שלח אימייל לאיפוס סיסמה</button>
              <button onClick={() => setModalIsOpen(false)}>סגור</button>
            </div>
          </div>
        </Modal>

    </div>
  );
};
