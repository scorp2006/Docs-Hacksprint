'use client';

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config';
import { Project } from '@/types/project';

const projectsRef = collection(db, 'projects');

export async function getAllProjects(userId: string): Promise<Project[]> {
  console.log('Getting all projects for user:', userId);
  try {
    const q = query(
      projectsRef,
      where('members', 'array-contains', userId)
    );
    
    const querySnapshot = await getDocs(q);
    console.log('Found projects:', querySnapshot.size);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate()
    })) as Project[];
  } catch (error) {
    console.error('Error in getAllProjects:', error);
    throw error;
  }
}

export async function createProject(projectData: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
  console.log('Creating project with data:', projectData);
  try {
    const newProject = {
      ...projectData,
      createdAt: Timestamp.now(),
      members: [projectData.createdBy], // Ensure creator is a member
      status: projectData.status || 'active'
    };
    
    console.log('Prepared project data:', newProject);
    const docRef = await addDoc(projectsRef, newProject);
    console.log('Created project with ID:', docRef.id);
    
    const projectDoc = await getDoc(docRef);
    
    if (!projectDoc.exists()) {
      throw new Error('Failed to create project');
    }
    
    const createdProject = {
      id: docRef.id,
      ...projectDoc.data(),
      createdAt: (projectDoc.data().createdAt as Timestamp).toDate()
    } as Project;
    
    console.log('Returning created project:', createdProject);
    return createdProject;
  } catch (error) {
    console.error('Error in createProject:', error);
    throw error;
  }
}

export async function getProject(projectId: string): Promise<Project | null> {
  console.log('Getting project:', projectId);
  try {
    const projectRef = doc(db, 'projects', projectId);
    const projectDoc = await getDoc(projectRef);
    
    if (!projectDoc.exists()) {
      console.log('Project not found:', projectId);
      return null;
    }
    
    const project = {
      id: projectDoc.id,
      ...projectDoc.data(),
      createdAt: (projectDoc.data().createdAt as Timestamp).toDate()
    } as Project;
    
    console.log('Found project:', project);
    return project;
  } catch (error) {
    console.error('Error in getProject:', error);
    throw error;
  }
}

export async function updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
  console.log('Updating project:', projectId, 'with updates:', updates);
  try {
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, updates);
    console.log('Project updated successfully');
  } catch (error) {
    console.error('Error in updateProject:', error);
    throw error;
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  console.log('Deleting project:', projectId);
  try {
    const projectRef = doc(db, 'projects', projectId);
    await deleteDoc(projectRef);
    console.log('Project deleted successfully');
  } catch (error) {
    console.error('Error in deleteProject:', error);
    throw error;
  }
} 