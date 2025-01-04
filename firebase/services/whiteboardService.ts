'use client';

import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  Timestamp, 
  serverTimestamp,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  writeBatch,
  DocumentReference,
  CollectionReference
} from 'firebase/firestore';
import { db } from '../config';
import { WhiteboardElement } from '@/types';

const COLLECTION = 'whiteboardElements';

// Get the collection reference once
const whiteboardElementsRef: CollectionReference = collection(db, COLLECTION);

export const whiteboardService = {
  async createElement(element: Omit<WhiteboardElement, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(whiteboardElementsRef, {
      ...element,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async updateElement(id: string, data: Partial<WhiteboardElement>): Promise<void> {
    const docRef: DocumentReference = doc(whiteboardElementsRef, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteElement(id: string): Promise<void> {
    const docRef: DocumentReference = doc(whiteboardElementsRef, id);
    await deleteDoc(docRef);
  },

  async getProjectElements(projectId: string): Promise<WhiteboardElement[]> {
    const q = query(
      whiteboardElementsRef,
      where('projectId', '==', projectId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
    })) as WhiteboardElement[];
  },

  async updateElements(projectId: string, elements: Partial<WhiteboardElement>[]): Promise<void> {
    const batch = writeBatch(db);

    elements.forEach(element => {
      if (!element.id) return;
      const docRef: DocumentReference = doc(whiteboardElementsRef, element.id);
      batch.update(docRef, {
        ...element,
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
  },

  // For real-time collaboration
  subscribeToProjectElements(projectId: string, callback: (elements: WhiteboardElement[]) => void) {
    return onSnapshot(
      query(whiteboardElementsRef, where('projectId', '==', projectId)),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const elements = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: (doc.data().createdAt as Timestamp).toDate(),
          updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
        })) as WhiteboardElement[];
        callback(elements);
      }
    );
  },
}; 