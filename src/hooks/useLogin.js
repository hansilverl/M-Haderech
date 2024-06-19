import { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const useLogin = () => {
  const [error, setError] = useState(null);

  const login = async (email, password, navigate) => {
    setError(null);
    try {
      // Login with email and password
      await signInWithEmailAndPassword(auth, email, password);
      // Navigate to the main page after successful login
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return { error, login };
};
