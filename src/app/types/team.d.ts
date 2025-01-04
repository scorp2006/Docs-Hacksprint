interface TeamMember {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  assignee?: TeamMember;
  dueDate: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}