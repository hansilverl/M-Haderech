import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import { auth } from '../../firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import Modal from 'react-modal';
import './Login.css';
import { useFirebaseErrorTranslation } from '../../hooks/useFirebaseErrorTranslation'; // Import the custom hook

Modal.setAppElement('#root'); // Set the app element for accessibility

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { error, login } = useLogin();
  const [loginError, setLoginError] = useState(null); // State for login error
  const translateErrorToHebrew = useFirebaseErrorTranslation(); // Use the custom hook
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      setLoginError(translateErrorToHebrew(error));
    }
  }, [error, translateErrorToHebrew]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, navigate);
    } catch (error) {
      setLoginError(translateErrorToHebrew(error.code));
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
    <>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>התחברות</h2>
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
            <span>סיסמא:</span>
            <input
              required
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </label>
          <button type="submit">התחברי</button>
          <button type="button" onClick={() => setModalIsOpen(true)}>איפוס סיסמה</button>
          {loginError && <p>{loginError}</p>}
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
    </>
  );
}
