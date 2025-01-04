'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Analytics } from 'firebase/analytics';
import { app, db, auth, analytics } from '../config';

interface FirebaseContextType {
  app: typeof app;
  db: typeof db;
  auth: typeof auth;
  analytics: Analytics | null;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseContext.Provider value={{ app, db, auth, analytics }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
} 