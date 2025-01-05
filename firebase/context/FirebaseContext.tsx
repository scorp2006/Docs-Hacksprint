'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Analytics } from 'firebase/analytics';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';
import { app, db, auth, analytics } from '../config';

interface FirebaseContextType {
  app: FirebaseApp;
  db: Firestore;
  auth: Auth;
  analytics: Analytics | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  app,
  db,
  auth,
  analytics,
});

export function useFirebase() {
  return useContext(FirebaseContext);
}

interface FirebaseProviderProps {
  children: ReactNode;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  return (
    <FirebaseContext.Provider value={{ app, db, auth, analytics }}>
      {children}
    </FirebaseContext.Provider>
  );
} 