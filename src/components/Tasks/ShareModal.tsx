import React, { useState } from 'react';
import { X, Mail, Users } from 'lucide-react';
import { Task } from '../../types';
import { useTask } from '../../context/TaskContext';

interface ShareModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ task, isOpen, onClose }) => {
  const { shareTask } = useTask();
  const [email, setEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  if (!isOpen) return null;

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSharing(true);
    try {
      await shareTask(task.id, email.trim());
      setEmail('');
      onClose();
    } catch (error) {
      console.error('Error sharing task:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Share Task
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">{task.title}</h4>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>

            {task.sharedWith.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Currently shared with:</h5>
                <div className="space-y-1">
                  {task.sharedWith.map((sharedEmail, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {sharedEmail}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleShare}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md shadow-sm focus:ring-primary-500 focus:outline-none sm:text-sm px-3 py-2"
                  placeholder="Enter email address..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSharing || !email.trim()}
                  className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSharing ? 'Sharing...' : 'Share Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};