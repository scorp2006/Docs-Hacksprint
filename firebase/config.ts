'use client';

import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
} as const;

// Validate required config values
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;
for (const key of requiredKeys) {
  if (!firebaseConfig[key]) {
    throw new Error(`Missing required Firebase configuration value: ${key}`);
  }
}

// Initialize Firebase
let app: FirebaseApp;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

// Initialize Analytics only on client side
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  // Check if analytics is supported before initializing
  isSupported()
    .then(supported => {
      if (supported && firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
      }
    })
    .catch(error => {
      console.error('Error checking analytics support:', error);
    });
}

export { app, db, auth, analytics }; 