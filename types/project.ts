export interface Project {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  members: string[];
  status: 'active' | 'archived' | 'completed';
} 