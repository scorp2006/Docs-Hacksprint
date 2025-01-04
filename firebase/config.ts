'use client';

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDCPk67kYH9SW7lH21IBf4cZTxpD54Kk8s",
  authDomain: "idea-hub-106e8.firebaseapp.com",
  projectId: "idea-hub-106e8",
  storageBucket: "idea-hub-106e8.firebasestorage.app",
  messagingSenderId: "662734909104",
  appId: "1:662734909104:web:1720b1ebbe00a90b791575",
  measurementId: "G-871JJMTC0D"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

// Initialize Analytics only on client side
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, db, auth, analytics }; 