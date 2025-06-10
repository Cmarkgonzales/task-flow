import React from 'react';
import type { Task } from '../types';

interface TaskListProps {
    loading: boolean;
    tasks: Task[];
    currentTheme: {
        border: string;
        primary: string;
        hover: string;
        ring: string;
        text: string;
    };
    searchTerm: string;
    setShowAddModal: (v: boolean) => void;
    setEditingTask: (v: Task) => void;
    setShowConfirmDelete: (v: string | null) => void;
    handleToggleComplete: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
    loading,
    tasks,
    currentTheme,
    searchTerm,
    setShowAddModal,
    setEditingTask,
    setShowConfirmDelete,
    handleToggleComplete
}) => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
            <div className="p-8 flex justify-center">
                <div className={`animate-spin rounded-full h-10 w-10 border-b-2 ${currentTheme.border}`}></div>
            </div>
        ) : tasks.length === 0 ? (
            <div className="p-8 text-center">
                <i className="fa-regular fa-clipboard mx-auto text-gray-400 text-5xl"></i>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks found</h3>
                <p className="mt-1 text-gray-500">
                    {searchTerm ? `No tasks found matching '${searchTerm}'.` : 'Get started by adding a new task.'}
                </p>
                <div className="mt-6">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${currentTheme.primary} ${currentTheme.hover} focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentTheme.ring}`}
                    >
                        <i className="fas fa-plus -ml-1 mr-2"></i>
                        Add a task
                    </button>
                </div>
            </div>
        ) : (
            <ul className="divide-y divide-gray-200">
                {tasks.map((task, index) => {
                    const now = new Date();
                    const dueDate = new Date(task.dueDate);

                    // Determine if the task is overdue (exact comparison with time)
                    const isOverdue = !task.completed && dueDate.getTime() < now.getTime();

                    // Calculate days remaining (based on exact time diff, not rounded up)
                    const timeDiff = dueDate.getTime() - now.getTime();
                    const daysRemaining = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                    return (
                        <li 
                            key={task.id} 
                            className={`p-4 transition duration-200 ease-in-out transform hover:scale-[1.01] hover:shadow-md hover:bg-gray-50 ${task.completed ? 'bg-gray-50' : ''} animate-slide-in`} 
                            style={{animationDelay: `${index * 0.05}s`}}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1">
                                    <div className="flex-shrink-0 pt-1">
                                        <button
                                            onClick={() => handleToggleComplete(task)}
                                            className={`h-6 w-6 rounded-full border-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentTheme.ring} transition-colors duration-200 ${
                                                task.completed 
                                                    ? 'bg-green-500 border-green-500' 
                                                    : `border-gray-300 hover:${currentTheme.border}`
                                            }`}
                                        >
                                            {task.completed && (
                                                <i className="fas fa-check text-white"></i>
                                            )}
                                        </button>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className={`text-base font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                                {task.title}
                                            </h3>
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                                ${task.priorityDisplay === 'High' ? 'bg-red-100 text-red-800' : 
                                                  task.priorityDisplay === 'Medium' ? 'bg-amber-100 text-amber-800' : 
                                                  'bg-green-100 text-green-800'}`}>
                                                {task.priorityDisplay }
                                            </span>
                                            
                                            {isOverdue && !task.completed && (
                                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                    Overdue
                                                </span>
                                            )}
                                            
                                            {!task.completed && !isOverdue && daysRemaining <= 3 && (
                                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                                                    Due soon
                                                </span>
                                            )}
                                        </div>
                                        <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {task.description}
                                        </p>
                                        <div className="mt-2 flex items-center text-xs text-gray-500">
                                            <i className="fa-regular fa-calendar mr-1"></i>
                                            <span className={isOverdue && !task.completed ? 'text-red-500 font-medium' : ''}>
                                                Due: {new Date(task.dueDate).toLocaleDateString('en-US', { 
                                                    weekday: 'short', 
                                                    month: 'short', 
                                                    day: 'numeric' 
                                                })}
                                            </span>
                                            
                                            {!task.completed && (
                                                <span className="ml-2">
                                                    {daysRemaining === 0
                                                        ? 'Today'
                                                        : daysRemaining === 1
                                                        ? 'Tomorrow'
                                                        : daysRemaining > 1
                                                        ? `${daysRemaining} days left`
                                                        : daysRemaining === -1
                                                        ? 'Yesterday'
                                                        : `${Math.abs(daysRemaining)} days overdue`}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-4 flex-shrink-0 flex space-x-2">
                                    <button
                                        onClick={() =>
                                            setEditingTask({
                                                ...task,
                                                dueDate: new Date(task.dueDate).toISOString().split('T')[0], // ensures yyyy-MM-dd format
                                            })
                                        }
                                        className={`w-8 h-8 flex items-center justify-center bg-white text-gray-500 hover:${currentTheme.text} rounded-full hover:bg-gray-100 transition-colors duration-200`}
                                        title="Edit task"
                                    >
                                        <i className="fa-regular fa-pen-to-square"></i>
                                    </button>
                                    <button
                                        onClick={() => setShowConfirmDelete(task.id !== undefined ? String(task.id) : null)}
                                        className="w-8 h-8 flex items-center justify-center bg-white text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                        title="Delete task"
                                    >
                                        <i className="fa-regular fa-trash-can"></i>
                                    </button>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        )}
    </div>
);

export default TaskList;
