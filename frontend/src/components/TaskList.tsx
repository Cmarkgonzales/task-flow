import React from 'react';
import type { Task } from '../types/index';

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
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks found</h3>
                <p className="mt-1 text-gray-500">
                    {searchTerm ? `No tasks found matching '${searchTerm}'.` : 'Get started by adding a new task.'}
                </p>
                <div className="mt-6">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${currentTheme.primary} ${currentTheme.hover} focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentTheme.ring}`}
                    >
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
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
                                                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
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
                                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
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
                                        className={`bg-white text-gray-500 hover:${currentTheme.text} p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200`}
                                        title="Edit task"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setShowConfirmDelete(task.id !== undefined ? String(task.id) : null)}
                                        className="bg-white text-gray-500 hover:text-red-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                        title="Delete task"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
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
