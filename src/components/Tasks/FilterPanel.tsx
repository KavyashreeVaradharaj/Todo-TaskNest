import React from 'react';
import { Filter, X } from 'lucide-react';
import { useTask } from '../../context/TaskContext';

export const FilterPanel: React.FC = () => {
  const { filters, setFilters } = useTask();

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Medium', color: 'bg-orange-100 text-orange-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' },
  ];

  const dueDateOptions = [
    { value: 'all', label: 'All' },
    { value: 'today', label: 'Due Today' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'this-week', label: 'This Week' },
    { value: 'next-week', label: 'Next Week' },
  ];

  const toggleStatusFilter = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    setFilters({ status: newStatus });
  };

  const togglePriorityFilter = (priority: string) => {
    const newPriority = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority];
    setFilters({ priority: newPriority });
  };

  const clearAllFilters = () => {
    setFilters({
      status: [],
      priority: [],
      dueDate: 'all',
      search: ''
    });
  };

  const hasActiveFilters = filters.status.length > 0 || filters.priority.length > 0 || filters.dueDate !== 'all' || filters.search !== '';

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="space-y-2">
            {statusOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.status.includes(option.value)}
                  onChange={() => toggleStatusFilter(option.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded"
                />
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <div className="space-y-2">
            {priorityOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.priority.includes(option.value)}
                  onChange={() => togglePriorityFilter(option.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded"
                />
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Due Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
          <select
            value={filters.dueDate}
            onChange={(e) => setFilters({ dueDate: e.target.value as any })}
            className="block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 sm:text-sm"
          >
            {dueDateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};