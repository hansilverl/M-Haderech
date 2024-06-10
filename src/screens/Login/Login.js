import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import { auth } from '../../firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { error, login } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, navigate);
  };

  const handleResetPassword = () => {
    const email = prompt("אנא הזיני את כתובת האימייל שלך עבור איפוס הסיסמה:");
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent
          alert("אימייל לאיפוס סיסמה נשלח אליך.");
        })
        .catch((error) => {
          // Error occurred. Handle error
          alert("אירעה שגיאה בשליחת האימייל: " + error.message);
        });
    }
  };

  return (
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
        <button type="button" onClick={handleResetPassword}>איפוס סיסמה</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
