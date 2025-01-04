'use client';

import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp,
  DocumentReference,
  CollectionReference
} from 'firebase/firestore';
import { db } from '../config';
import { User } from '@/types';

const COLLECTION = 'users';

// Get the collection reference once
const usersRef = collection(db, COLLECTION);

export const userService = {
  async createOrUpdateUser(user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  }): Promise<void> {
    try {
      const userRef: DocumentReference = doc(usersRef, user.uid);
      
      // First check if the user document exists
      const userDoc = await getDoc(userRef);
      
      const userData = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        updatedAt: serverTimestamp(),
      };

      if (!userDoc.exists()) {
        // If it's a new user, add createdAt
        await setDoc(userRef, {
          ...userData,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });
      } else {
        // If user exists, just update lastLoginAt
        await setDoc(userRef, {
          ...userData,
          lastLoginAt: serverTimestamp(),
        }, { merge: true });
      }
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  },

  async getUser(userId: string): Promise<User | null> {
    try {
      const userRef: DocumentReference = doc(usersRef, userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return null;
      }

      return {
        id: userDoc.id,
        ...userDoc.data(),
      } as User;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },
}; 