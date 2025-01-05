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
  arrayUnion,
  arrayRemove
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

export async function inviteMemberToProject(projectId: string, memberEmail: string): Promise<void> {
  console.log('Inviting member to project:', projectId, 'email:', memberEmail);
  try {
    // First, find the user by email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', memberEmail));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('User not found with this email');
    }
    
    const userId = querySnapshot.docs[0].id;
    const projectRef = doc(db, 'projects', projectId);
    
    // Add the user to the project members
    await updateDoc(projectRef, {
      members: arrayUnion(userId)
    });
    
    console.log('Member added successfully');
  } catch (error) {
    console.error('Error in inviteMemberToProject:', error);
    throw error;
  }
}

export async function removeMemberFromProject(projectId: string, memberId: string): Promise<void> {
  console.log('Removing member from project:', projectId, 'memberId:', memberId);
  try {
    const projectRef = doc(db, 'projects', projectId);
    
    await updateDoc(projectRef, {
      members: arrayRemove(memberId)
    });
    
    console.log('Member removed successfully');
  } catch (error) {
    console.error('Error in removeMemberFromProject:', error);
    throw error;
  }
}

export async function getProjectMembers(projectId: string): Promise<{ id: string; email: string; displayName: string }[]> {
  console.log('Getting members for project:', projectId);
  try {
    const projectRef = doc(db, 'projects', projectId);
    const projectDoc = await getDoc(projectRef);
    
    if (!projectDoc.exists()) {
      throw new Error('Project not found');
    }
    
    const memberIds = projectDoc.data().members || [];
    const usersRef = collection(db, 'users');
    const members = await Promise.all(
      memberIds.map(async (memberId: string) => {
        const userDoc = await getDoc(doc(usersRef, memberId));
        return {
          id: userDoc.id,
          ...userDoc.data()
        };
      })
    );
    
    return members;
  } catch (error) {
    console.error('Error in getProjectMembers:', error);
    throw error;
  }
}

export const projectService = {
  getAllProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  inviteMemberToProject,
  removeMemberFromProject,
  getProjectMembers
}; 