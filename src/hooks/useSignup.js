// src/hooks/useSignup.js
import { useState } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const useSignup = () => {
  const [error, setError] = useState(null);

  const signup = async (email, password, navigate = null, shouldSignIn = true) => {
    setError(null);
    try {
      // Create user with email and password
      await createUserWithEmailAndPassword(auth, email, password);

      // Add user details to Firestore with email as document ID
      await setDoc(doc(db, 'users', email), {
        email: email,
        isAdmin: false,
      });

      // Sign out the newly created user if shouldSignIn is false
      if (!shouldSignIn) {
        await signOut(auth);
      }

      // Redirect to the main page if navigate is provided and shouldSignIn is true
      if (navigate && shouldSignIn) navigate('/');
      
      return true; // Indicate success
    } catch (err) {
      setError(err.code);
      return false; // Indicate failure
    }
  };

  return { error, signup };
};
