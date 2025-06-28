import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, FilterOptions, TaskContextType } from '../types';
import { useAuth } from './AuthContext';
import { isToday, isPast, isThisWeek, addWeeks, isSameWeek, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 12; // Updated to 12 tasks per page
  
  const [filters, setFiltersState] = useState<FilterOptions>({
    status: [],
    priority: [],
    dueDate: 'all',
    search: ''
  });

  // Load tasks from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedTasks = localStorage.getItem('tasknest_tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks.filter((task: Task) => task.userId === user.id || task.sharedWith.includes(user.email)));
      } else {
        // Generate sample tasks for demo
        generateSampleTasks();
      }
    }
  }, [user]);

  const generateSampleTasks = () => {
    if (!user) return;
    
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Complete project proposal',
        description: 'Finalize the quarterly project proposal for client review',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        sharedWith: [],
        tags: ['work', 'urgent']
      },
      {
        id: '2',
        title: 'Team meeting preparation',
        description: 'Prepare agenda and materials for weekly team sync',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        sharedWith: [],
        tags: ['meeting', 'team']
      },
      {
        id: '3',
        title: 'Code review',
        description: 'Review pull requests from team members',
        priority: 'medium',
        status: 'completed',
        dueDate: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        sharedWith: [],
        tags: ['development', 'review']
      },
      {
        id: '4',
        title: 'Update documentation',
        description: 'Update API documentation with latest changes',
        priority: 'low',
        status: 'pending',
        dueDate: new Date(Date.now() + 172800000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        sharedWith: [],
        tags: ['documentation', 'api']
      },
      {
        id: '5',
        title: 'Client presentation',
        description: 'Prepare slides for quarterly business review',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 259200000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        sharedWith: [],
        tags: ['presentation', 'client']
      },
      {
        id: '6',
        title: 'Database optimization',
        description: 'Optimize database queries for better performance',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(Date.now() + 345600000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        sharedWith: [],
        tags: ['database', 'performance']
      },
      {
        id: '7',
        title: 'Security audit',
        description: 'Conduct security audit of the application',
        priority: 'high',
        status: 'pending',
        dueDate: new Date(Date.now() + 432000000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        sharedWith: [],
        tags: ['security', 'audit']
      },
      {
        id: '8',
        title: 'User testing',
        description: 'Conduct user testing sessions for new features',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(Date.now() + 518400000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        sharedWith: [],
        tags: ['testing', 'ux']
      },
      {
        id: '9',
        title: 'Mobile app update',
        description: 'Release new version of mobile application',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 604800000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        sharedWith: [],
        tags: ['mobile', 'release']
      },
      {
        id: '10',
        title: 'Training session',
        description: 'Organize training session for new team members',
        priority: 'low',
        status: 'pending',
        dueDate: new Date(Date.now() + 691200000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        sharedWith: [],
        tags: ['training', 'team']
      },
      {
        id: '11',
        title: 'Budget planning',
        description: 'Plan budget for next quarter',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(Date.now() + 777600000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        sharedWith: [],
        tags: ['budget', 'planning']
      },
      {
        id: '12',
        title: 'Server maintenance',
        description: 'Perform scheduled server maintenance',
        priority: 'high',
        status: 'pending',
        dueDate: new Date(Date.now() + 864000000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        sharedWith: [],
        tags: ['server', 'maintenance']
      },
      {
        id: '13',
        title: 'Marketing campaign',
        description: 'Launch new product marketing campaign',
        priority: 'high',
        status: 'pending',
        dueDate: new Date(Date.now() + 950400000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        sharedWith: [],
        tags: ['marketing', 'campaign']
      },
      {
        id: '14',
        title: 'Performance review',
        description: 'Conduct quarterly performance reviews',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(Date.now() + 1036800000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        sharedWith: [],
        tags: ['hr', 'review']
      },
      {
        id: '15',
        title: 'System backup',
        description: 'Perform weekly system backup and verification',
        priority: 'low',
        status: 'completed',
        dueDate: new Date(Date.now() - 172800000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        sharedWith: [],
        tags: ['backup', 'system']
      }
    ];
    
    setTasks(sampleTasks);
    localStorage.setItem('tasknest_tasks', JSON.stringify(sampleTasks));
  };

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(task.status)) {
      return false;
    }

    // Priority filter
    if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
      return false;
    }

    // Due date filter
    if (filters.dueDate !== 'all') {
      const taskDueDate = parseISO(task.dueDate);
      switch (filters.dueDate) {
        case 'today':
          if (!isToday(taskDueDate)) return false;
          break;
        case 'overdue':
          if (!isPast(taskDueDate) || isToday(taskDueDate)) return false;
          break;
        case 'this-week':
          if (!isThisWeek(taskDueDate)) return false;
          break;
        case 'next-week':
          if (!isSameWeek(taskDueDate, addWeeks(new Date(), 1))) return false;
          break;
      }
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id
      };

      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      localStorage.setItem('tasknest_tasks', JSON.stringify(updatedTasks));
      toast.success('Task created successfully!');
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
      );
      
      setTasks(updatedTasks);
      localStorage.setItem('tasknest_tasks', JSON.stringify(updatedTasks));
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      localStorage.setItem('tasknest_tasks', JSON.stringify(updatedTasks));
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setIsLoading(false);
    }
  };

  const shareTask = async (taskId: string, email: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedTasks = tasks.map(task =>
        task.id === taskId 
          ? { ...task, sharedWith: [...task.sharedWith, email], updatedAt: new Date().toISOString() }
          : task
      );
      
      setTasks(updatedTasks);
      localStorage.setItem('tasknest_tasks', JSON.stringify(updatedTasks));
      toast.success(`Task shared with ${email}!`);
    } catch (error) {
      toast.error('Failed to share task');
    } finally {
      setIsLoading(false);
    }
  };

  const setFilters = (newFilters: Partial<FilterOptions>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      filteredTasks,
      filters,
      currentPage,
      tasksPerPage,
      totalPages,
      isLoading,
      addTask,
      updateTask,
      deleteTask,
      setFilters,
      setCurrentPage,
      shareTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};