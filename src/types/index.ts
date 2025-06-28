export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'github';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  sharedWith: string[];
  tags: string[];
}

export interface FilterOptions {
  status: string[];
  priority: string[];
  dueDate: 'all' | 'today' | 'overdue' | 'this-week' | 'next-week';
  search: string;
}

export interface AuthContextType {
  user: User | null;
  login: (provider: 'google' | 'github') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  filters: FilterOptions;
  currentPage: number;
  tasksPerPage: number;
  totalPages: number;
  isLoading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilters: (filters: Partial<FilterOptions>) => void;
  setCurrentPage: (page: number) => void;
  shareTask: (taskId: string, email: string) => Promise<void>;
}