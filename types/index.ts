export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

export interface WhiteboardElement {
  id: string;
  type: 'sticky' | 'shape' | 'drawing' | 'text';
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