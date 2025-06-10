import React from 'react';
import type { ThemeName, Task } from '../types';


interface FilterSortControlsProps {
    filter: string;
    handleFilterChange: (v: string) => void;
    currentTheme: ThemeName;
    tasks: Task[];
    sortBy: string;
    sortOrder: string;
    handleSorting: (v: string) => void;
}

const FilterSortControls: React.FC<FilterSortControlsProps> = ({
    filter,
    handleFilterChange,
    currentTheme,
    tasks,
    sortBy,
    sortOrder,
    handleSorting
}) => (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            <button
                onClick={() => handleFilterChange('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    filter === 'all' 
                        ? `bg-${currentTheme}-600 text-white` 
                        : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
                All
            </button>
            <button
                onClick={() => handleFilterChange('active')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    filter === 'active' 
                        ? `bg-${currentTheme}-600 text-white` 
                        : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
                Active
            </button>
            <button
                onClick={() => handleFilterChange('completed')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    filter === 'completed' 
                        ? `bg-${currentTheme}-600 text-white` 
                        : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
                Completed
            </button>
        </div>
        
        <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} {filter !== 'all' ? `(${filter})` : ''}
            </div>
            
            <div className="relative">
                <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {handleSorting(e.target.value) }}
                    className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="dueDate-asc">Due Date (Earliest)</option>
                    <option value="dueDate-desc">Due Date (Latest)</option>
                    <option value="priority-desc">Priority (Highest)</option>
                    <option value="priority-asc">Priority (Lowest)</option>
                    <option value="title-asc">Title (A-Z)</option>
                    <option value="title-desc">Title (Z-A)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <i className="fas fa-caret-down"></i>
                </div>
            </div>
        </div>
    </div>
);

export default FilterSortControls;
