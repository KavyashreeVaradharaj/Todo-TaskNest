import React, { useState } from 'react';
import { Calendar, Clock, Share, Edit, Trash2, CheckCircle, PlayCircle, User } from 'lucide-react';
import { Task } from '../../types';
import { useTask } from '../../context/TaskContext';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { TaskModal } from './TaskModal';
import { ShareModal } from './ShareModal';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTask, deleteTask } = useTask();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDueDateStatus = () => {
    const dueDate = parseISO(task.dueDate);
    if (task.status === 'completed') return 'completed';
    if (isPast(dueDate) && !isToday(dueDate)) return 'overdue';
    if (isToday(dueDate)) return 'today';
    return 'upcoming';
  };

  const dueDateStatus = getDueDateStatus();

  const handleStatusChange = async (newStatus: Task['status']) => {
    await updateTask(task.id, { status: newStatus });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 animate-fade-in">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
            
            <div className="flex items-center space-x-2 mb-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                {task.status.replace('-', ' ')}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span className={`${
                  dueDateStatus === 'overdue' ? 'text-red-600 font-medium' :
                  dueDateStatus === 'today' ? 'text-orange-600 font-medium' :
                  'text-gray-500'
                }`}>
                  {format(parseISO(task.dueDate), 'MMM dd, yyyy')}
                </span>
              </div>
              
              {task.sharedWith.length > 0 && (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Shared with {task.sharedWith.length}</span>
                </div>
              )}
            </div>

            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {task.status !== 'completed' && (
              <button
                onClick={() => handleStatusChange(task.status === 'pending' ? 'in-progress' : 'completed')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                {task.status === 'pending' ? (
                  <>
                    <PlayCircle className="h-3 w-3 mr-1" />
                    Start
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Complete
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowShareModal(true)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
              title="Share task"
            >
              <Share className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
              title="Edit task"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
              title="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <TaskModal
          task={task}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showShareModal && (
        <ShareModal
          task={task}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
};