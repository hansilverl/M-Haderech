import React, { useState, useEffect } from 'react';
import './LoginPopup.css';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import { useSignup } from '../../hooks/useSignup';
import { auth } from '../../firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useFirebaseErrorTranslation } from '../../hooks/useFirebaseErrorTranslation';
import crossButton from '../../assets/cross_icon.png'; // Adjust the path as needed
import Modal from 'react-modal';

Modal.setAppElement('#root');

export const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("התחברות");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { error: loginError, login } = useLogin();
  const { error: signupError, signup } = useSignup();
  const [authError, setAuthError] = useState(null);
  const translateErrorToHebrew = useFirebaseErrorTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loginError || signupError) {
      const error = loginError ? loginError : signupError;
      setAuthError(translateErrorToHebrew(error.code));
    }
  }, [loginError, signupError, translateErrorToHebrew]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, navigate);
      setAuthError(null);
      setShowLogin(false); // Close the modal only if login is successful
    } catch (error) {
      setAuthError(translateErrorToHebrew(error.code));
      setShowLogin(true); // Keep the modal open if login fails
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, navigate, true);
      setAuthError(null);
      setShowLogin(false); // Close the modal only if signup is successful
    } catch (error) {
      setAuthError(translateErrorToHebrew(error.code));
      setShowLogin(true); // Keep the modal open if signup fails
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
        <button type="submit">
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
        parentSelector={() => document.querySelector('.login-popup')}
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
