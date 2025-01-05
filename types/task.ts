export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  assignedTo?: string;
  status: 'todo' | 'in-progress' | 'completed';
  order: number;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
} 