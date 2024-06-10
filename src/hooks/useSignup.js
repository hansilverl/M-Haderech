// src/hooks/useSignup.js
import { useState } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const useSignup = () => {
  const [error, setError] = useState(null);

  const signup = async (email, password, navigate = null, shouldNavigate = true) => {
    setError(null);
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Add user details to Firestore
      await setDoc(doc(db, 'users', email), {
        email: email,
        isAdmin: false,
      });
      // Redirect to the main page if navigate is provided and shouldNavigate is true
      if (navigate && shouldNavigate) navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return { error, signup };
};
