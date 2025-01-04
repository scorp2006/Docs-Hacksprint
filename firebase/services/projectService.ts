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
  getDoc, 
  arrayUnion, 
  arrayRemove,
  DocumentReference,
  CollectionReference
} from 'firebase/firestore';
import { db } from '../config';
import { Project } from '@/types';

const COLLECTION = 'projects';

// Mock data for development
const mockProjects: Project[] = [
  {
    id: 'mock-project-1',
    name: 'Sample Project',
    description: 'A sample project for development',
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: 'mock-user-123',
    members: ['mock-user-123'],
  },
  {
    id: 'mock-project-2',
    name: 'Another Project',
    description: 'Another sample project',
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: 'mock-user-123',
    members: ['mock-user-123'],
  }
];

// Get the collection reference once
const projectsRef: CollectionReference = collection(db, COLLECTION);

export const projectService = {
  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    // For development, return mock data
    return 'mock-project-' + (mockProjects.length + 1);
  },

  async updateProject(id: string, data: Partial<Project>): Promise<void> {
    // No-op for development
    return;
  },

  async deleteProject(id: string): Promise<void> {
    // No-op for development
    return;
  },

  async getProject(id: string): Promise<Project | null> {
    // For development, return mock data
    return mockProjects.find(p => p.id === id) || null;
  },

  async getUserProjects(userId: string): Promise<Project[]> {
    // For development, return mock data
    return mockProjects;
  },

  async inviteMember(projectId: string, email: string): Promise<void> {
    // No-op for development
    return;
  },

  async removeMember(projectId: string, userId: string): Promise<void> {
    // No-op for development
    return;
  },
}; 