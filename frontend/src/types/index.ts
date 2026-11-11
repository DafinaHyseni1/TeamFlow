export interface Project {
  id: number;
  name: string;
  category: string;
  description: string;
  progress: number;
  color: 'purple' | 'blue' | 'orange';
  totalTasks: number;
  completedTasks: number;
}

export interface Task {
  id: number;
  name: string;
  projectId: number;
  project: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Completed';
  dueDate: string;
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}
