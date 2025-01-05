'use client';

import { useEffect, useState } from 'react';
import { User, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../config';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        console.log('Auth state changed:', user ? 'User logged in' : 'No user');
        setUser(user);
        setLoading(false);
      },
      (error) => {
        console.error('Auth state error:', error);
        setError(error as Error);
        setLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    console.log('Attempting Google sign in');
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign in successful:', result.user.uid);
      return result;
    } catch (error) {
      console.error('Google sign in error:', error);
      setError(error as Error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('Attempting sign out');
    try {
      await firebaseSignOut(auth);
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error as Error);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
  };
} 