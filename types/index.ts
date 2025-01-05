export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  projects?: string[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  members: string[];
  status: 'active' | 'archived';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  order: number;
  projectId: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface WhiteboardElement {
  id: string;
  type: 'drawing' | 'rectangle' | 'circle' | 'text';
  content: any;
  position: {
    x: number;
    y: number;
  };
  style?: {
    color?: string;
    size?: number;
    [key: string]: any;
  };
  createdBy: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  parentId: string; // can be taskId or whiteboardElementId
  parentType: 'task' | 'whiteboardElement';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
} 