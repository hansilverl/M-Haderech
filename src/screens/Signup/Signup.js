//src/screens/Signup/Signup.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '../../hooks/useSignup';
import useFirebaseErrorTranslation from '../../hooks/useFirebaseErrorTranslation';
import './Signup.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { error, signup } = useSignup();
  const translateErrorToHebrew = useFirebaseErrorTranslation();
  const [signupError, setSignupError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      setSignupError(translateErrorToHebrew(error.code));
    }
  }, [error, translateErrorToHebrew]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signup(email, password, navigate, true);
      if (!result) {
        setSignupError(translateErrorToHebrew(error.code));
      }
    } catch (err) {
      setSignupError(translateErrorToHebrew(err.code));
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>הרשמה לאתר</h2>
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
        <button type="submit">הרשמה</button>
        {signupError && <p>{signupError}</p>}
      </form>
    </div>
  );
}
