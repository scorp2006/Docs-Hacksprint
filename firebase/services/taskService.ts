'use client';

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config';
import { Task } from '@/types/task';

const tasksRef = collection(db, 'tasks');

export async function createTask(taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  const newTask = {
    ...taskData,
    createdAt: Timestamp.now()
  };
  
  const docRef = await addDoc(tasksRef, newTask);
  return {
    id: docRef.id,
    ...newTask,
    createdAt: newTask.createdAt.toDate()
  };
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, updates);
}

export async function deleteTask(taskId: string): Promise<void> {
  const taskRef = doc(db, 'tasks', taskId);
  await deleteDoc(taskRef);
}

export async function getProjectTasks(projectId: string): Promise<Task[]> {
  const q = query(
    tasksRef,
    where('projectId', '==', projectId),
    orderBy('order', 'asc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate()
  })) as Task[];
}

export async function getUserTasks(userId: string): Promise<Task[]> {
  const q = query(
    tasksRef,
    where('assignedTo', '==', userId)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate()
  })) as Task[];
}

export async function updateTasksOrder(tasks: { id: string; order: number }[]): Promise<void> {
  const batchOp = writeBatch(db);
  
  tasks.forEach(task => {
    const taskRef = doc(db, 'tasks', task.id);
    batchOp.update(taskRef, { order: task.order });
  });
  
  await batchOp.commit();
} 