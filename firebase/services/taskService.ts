'use client';

import { Task } from '@/types';

// Mock data for development
const mockTasks: Task[] = [
  {
    id: 'task-1',
    projectId: 'mock-project-1',
    title: 'Design User Interface',
    description: 'Create wireframes and mockups for the main dashboard',
    status: 'pending',
    createdBy: 'mock-user-123',
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 0,
  },
  {
    id: 'task-2',
    projectId: 'mock-project-1',
    title: 'Implement Authentication',
    description: 'Set up Firebase authentication and user management',
    status: 'completed',
    createdBy: 'mock-user-123',
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 1,
  },
  {
    id: 'task-3',
    projectId: 'mock-project-1',
    title: 'Create Database Schema',
    description: 'Design and implement Firestore data structure',
    status: 'pending',
    createdBy: 'mock-user-123',
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 2,
  },
];

export const taskService = {
  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    // For development, return mock data
    const newTask = {
      id: `task-${mockTasks.length + 1}`,
      ...task,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockTasks.push(newTask);
    return newTask.id;
  },

  async updateTask(id: string, data: Partial<Task>): Promise<void> {
    // For development, update mock data
    const taskIndex = mockTasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
      mockTasks[taskIndex] = {
        ...mockTasks[taskIndex],
        ...data,
        updatedAt: new Date(),
      };
    }
  },

  async deleteTask(id: string): Promise<void> {
    // For development, remove from mock data
    const taskIndex = mockTasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
      mockTasks.splice(taskIndex, 1);
    }
  },

  async getProjectTasks(projectId: string): Promise<Task[]> {
    // For development, return mock data
    return mockTasks.filter(task => task.projectId === projectId)
      .sort((a, b) => a.order - b.order);
  },

  async reorderTasks(tasks: { id: string; order: number }[]): Promise<void> {
    // For development, update mock data
    tasks.forEach(({ id, order }) => {
      const task = mockTasks.find(t => t.id === id);
      if (task) {
        task.order = order;
        task.updatedAt = new Date();
      }
    });
  },
}; 