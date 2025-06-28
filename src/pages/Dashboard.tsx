import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Header } from '../components/Layout/Header';
import { FilterPanel } from '../components/Tasks/FilterPanel';
import { TaskList } from '../components/Tasks/TaskList';
import { TaskModal } from '../components/Tasks/TaskModal';

export const Dashboard: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates by triggering a re-render
      // In a real app, this would be WebSocket updates
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-6 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Manage your tasks efficiently</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </button>
          </div>

          <FilterPanel />
          <TaskList />
        </div>
      </main>

      {showCreateModal && (
        <TaskModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};