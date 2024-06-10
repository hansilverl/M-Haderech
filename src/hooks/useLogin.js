// src/hooks/useLogin.js
import { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const useLogin = () => {
  const [error, setError] = useState(null);

  const login = async (email, password, navigate) => {
    setError(null);
    try {
      // login with email and password
      await signInWithEmailAndPassword(auth, email, password);

      // Redirect to the main page
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return { error, login };
}
