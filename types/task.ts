export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  assignedTo: string;
  status: 'todo' | 'in-progress' | 'completed';
  order: number;
  createdAt: Date;
  dueDate?: Date;
} 