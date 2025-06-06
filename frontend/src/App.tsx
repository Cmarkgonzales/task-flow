
import React from 'react';
import { fetchAllTasks, addTask, updateTask, deleteTask } from './api/taskService';
import type { Task, TaskParams } from './types';

function App() {
            const [tasks, setTasks] = React.useState<Task[]>([]);
            const [loading, setLoading] = React.useState(true);
            const [error, setError] = React.useState<string | null>(null);
            const [showAddModal, setShowAddModal] = React.useState(false);
            const [editingTask, setEditingTask] = React.useState<Task | null>(null);
            const [filter, setFilter] = React.useState('all');
            const [searchTerm, setSearchTerm] = React.useState('');
            const [notification, setNotification] = React.useState<string | null>(null);
            const [sortBy, setSortBy] = React.useState('dueDate');
            const [sortOrder, setSortOrder] = React.useState('asc');
            const [showConfirmDelete, setShowConfirmDelete] = React.useState<string | null>(null);
            const [isSearchFocused, setIsSearchFocused] = React.useState(false);

            // Theme colors using Tailwind classes
            type ThemeName = 'indigo' | 'purple' | 'teal' | 'rose';
            const themeColors: Record<ThemeName, {
                primary: string;
                hover: string;
                light: string;
                text: string;
                border: string;
                gradient: string;
                ring: string;
            }> = {
                indigo: {
                    primary: 'bg-indigo-600',
                    hover: 'hover:bg-indigo-700',
                    light: 'bg-indigo-50',
                    text: 'text-indigo-600',
                    border: 'border-indigo-500',
                    gradient: 'from-indigo-50 to-blue-50',
                    ring: 'focus:ring-indigo-500',
                },
                purple: {
                    primary: 'bg-purple-600',
                    hover: 'hover:bg-purple-700',
                    light: 'bg-purple-50',
                    text: 'text-purple-600',
                    border: 'border-purple-500',
                    gradient: 'from-purple-50 to-pink-50',
                    ring: 'focus:ring-purple-500',
                },
                teal: {
                    primary: 'bg-teal-600',
                    hover: 'hover:bg-teal-700',
                    light: 'bg-teal-50',
                    text: 'text-teal-600',
                    border: 'border-teal-500',
                    gradient: 'from-teal-50 to-emerald-50',
                    ring: 'focus:ring-teal-500',
                },
                rose: {
                    primary: 'bg-rose-600',
                    hover: 'hover:bg-rose-700',
                    light: 'bg-rose-50',
                    text: 'text-rose-600',
                    border: 'border-rose-500',
                    gradient: 'from-rose-50 to-orange-50',
                    ring: 'focus:ring-rose-500',
                }
            };
            
            const [theme, setTheme] = React.useState<ThemeName>('indigo');
            
            const currentTheme = themeColors[theme];

            // Fetch tasks on component mount
            React.useEffect(() => {
                fetchTasks('priority-desc', 'all');
            }, []);

            const fetchTasks = async (sort: string = '', status: string = 'all') => {
                try {
                    setLoading(true);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // debounce

                    const queryParams: TaskParams = {};
                    if (sort) queryParams.sort = sort;
                    if (status !== 'all') queryParams.status = status;
                    console.log("Fetching tasks with params:", queryParams);
                    const response = await fetchAllTasks(queryParams);
                    setTasks(response.data);
                    setError(null);
                } catch (err) {
                    setError("Failed to fetch tasks. Please try again.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };

            const handleSorting = async (sort: string) => {
                const [sortBy, sortOrder] = sort.split('-');
                setSortBy(sortBy);
                setSortOrder(sortOrder);
                await fetchTasks(sort, filter);
            };

            const handleFilterChange = async (newFilter: string) => {
                setFilter(newFilter);
                await fetchTasks(sortBy + '-' + sortOrder, newFilter);
            };
            const handleAddTask = async (task: Task) => {
                try {
                    setLoading(true);
                    const response = await addTask(task);
                    const newTask = response.data;
                    setTasks(prev => [...prev, newTask]);
                    setShowAddModal(false);
                    showNotification("✅ Task added successfully!");
                } catch (err) {
                    setError("Failed to add task. Please try again.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };

            const handleUpdateTask = async (task: Task) => {
                try {
                    setLoading(true);
                    const response = await updateTask(task.id!, task);
                    const updatedTask = response.data;
                    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
                    setEditingTask(null);
                    showNotification("✅ Task updated successfully!");
                } catch (err) {
                    setError("Failed to update task. Please try again.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };

            const handleDeleteTask = async (id: number) => {
                try {
                    setLoading(true);
                    await deleteTask(id);
                    setTasks(prev => prev.filter(task => task.id !== id));
                    setShowConfirmDelete(null);
                    showNotification("🗑️ Task deleted successfully!");
                } catch (err) {
                    setError("Failed to delete task. Please try again.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };

            const handleToggleComplete = async (task: Task) => {
                const updatedTask = { ...task, completed: !task.completed };
                await handleUpdateTask(updatedTask);
                showNotification(updatedTask.completed ? "✅ Task marked as complete!" : "⏪ Task marked as incomplete");
            };

            const showNotification = (message: string) => {
                setNotification(message);
                setTimeout(() => {
                    setNotification(null);
                }, 3000);
            };

            // Calculate task statistics
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(task => task.completed).length;
            const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            const upcomingTasks = tasks.filter(task => !task.completed && new Date(task.dueDate) > new Date()).length;
            const overdueTasks = tasks.filter(task => !task.completed && new Date(task.dueDate) < new Date()).length;

            return (
                <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient}`}>
                    <header className="bg-white shadow-sm sticky top-0 z-10">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="flex items-center justify-center w-16 h-16 rounded-2xl mx-auto">
                                    <i className={`fa-solid fa-list-check text-4xl ${currentTheme.text}`} />
                                </div>
                                <h1 className="ml-2 text-2xl font-bold text-gray-900">TaskFlow</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className={`relative ${isSearchFocused ? 'w-64' : 'w-48'} transition-all duration-300`}>
                                    <input
                                        type="text"
                                        placeholder="Search tasks..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setIsSearchFocused(false)}
                                        className={`pl-10 pr-4 py-2 border rounded-lg w-full transition-all duration-300 focus:outline-none ${currentTheme.ring} focus:border-indigo-500`}
                                    />
                                    <svg className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    {searchTerm && (
                                        <button 
                                            onClick={() => setSearchTerm('')}
                                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowAddModal(true)}
                                        className={`${currentTheme.primary} ${currentTheme.hover} text-white font-medium py-2 px-4 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105`}
                                    >
                                        <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add Task
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Dashboard Stats */}
                        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center animate-fade-in">
                                <div className={`p-3 rounded-full ${currentTheme.light} mr-4`}>
                                    <svg className={`h-6 w-6 ${currentTheme.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Tasks</p>
                                    <p className="text-xl font-semibold">{totalTasks}</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center animate-fade-in" style={{animationDelay: '0.1s'}}>
                                <div className="p-3 rounded-full bg-green-50 mr-4">
                                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Completed</p>
                                    <div className="flex items-center">
                                        <p className="text-xl font-semibold">{completedTasks}</p>
                                        <p className="ml-2 text-sm text-green-500">({completionRate}%)</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center animate-fade-in" style={{animationDelay: '0.2s'}}>
                                <div className="p-3 rounded-full bg-blue-50 mr-4">
                                    <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Upcoming</p>
                                    <p className="text-xl font-semibold">{upcomingTasks}</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center animate-fade-in" style={{animationDelay: '0.3s'}}>
                                <div className="p-3 rounded-full bg-amber-50 mr-4">
                                    <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Overdue</p>
                                    <p className="text-xl font-semibold">{overdueTasks}</p>
                                </div>
                            </div>
                        </div>

                        {/* Theme Selector */}
                        <div className="mb-6 flex justify-end">
                            <div className="bg-white rounded-lg shadow-sm p-2 flex space-x-2">
                                {Object.keys(themeColors).map(colorName => (
                                    <button
                                        key={colorName}
                                        onClick={() => setTheme(colorName as ThemeName)}
                                        className={`w-6 h-6 rounded-full ${themeColors[colorName as ThemeName].primary} ${theme === colorName ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                                        title={`${colorName.charAt(0).toUpperCase() + colorName.slice(1)} theme`}
                                    ></button>
                                ))}
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fade-in">
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-red-700">{error}</p>
                                </div>
                                <button 
                                    onClick={() => setError(null)}
                                    className="mt-2 text-sm text-red-700 hover:text-red-900 font-medium"
                                >
                                    Dismiss
                                </button>
                            </div>
                        )}

                        {/* Filter and Sort Controls */}
                        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                            <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
                                <button
                                    onClick={() => handleFilterChange('all')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                        filter === 'all' 
                                            ? `${currentTheme.primary} text-white` 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => handleFilterChange('active')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                        filter === 'active' 
                                            ? `${currentTheme.primary} text-white` 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => handleFilterChange('completed')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                        filter === 'completed' 
                                            ? `${currentTheme.primary} text-white` 
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
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Task list */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            {loading && tasks.length === 0 ? (
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
                                        {searchTerm ? 'Try adjusting your search term.' : 'Get started by adding a new task.'}
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
                                        // Calculate if task is overdue
                                        const isOverdue = !task.completed && new Date(task.dueDate) < new Date();
                                        
                                        // Calculate days remaining
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const dueDate = new Date(task.dueDate);
                                        dueDate.setHours(0, 0, 0, 0);
                                        const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                                        
                                        return (
                                            <li 
                                                key={task.id} 
                                                className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${task.completed ? 'bg-gray-50' : ''} animate-slide-in`} 
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
                                                                        {daysRemaining === 0 ? 'Today' : 
                                                                         daysRemaining === 1 ? 'Tomorrow' :
                                                                         daysRemaining > 0 ? `${daysRemaining} days left` :
                                                                         `${Math.abs(daysRemaining)} days overdue`}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                                                        <button
                                                            onClick={() => setEditingTask(task)}
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
                    </main>

                    {/* Add Task Modal */}
                    {showAddModal && (
                        <TaskModal
                            onClose={() => setShowAddModal(false)}
                            onSave={handleAddTask}
                            title="Add New Task"
                            theme={currentTheme} task={undefined}                        />
                    )}

                    {/* Edit Task Modal */}
                    {editingTask && (
                        <TaskModal
                            task={editingTask}
                            onClose={() => setEditingTask(null)}
                            onSave={handleUpdateTask}
                            title="Edit Task"
                            theme={currentTheme}
                        />
                    )}

                    {/* Confirm Delete Modal */}
                    {showConfirmDelete && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fade-in">
                                <div className="p-6">
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="bg-red-100 rounded-full p-3">
                                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Delete Task</h3>
                                    <p className="text-center text-gray-600 mb-6">
                                        Are you sure you want to delete this task? This action cannot be undone.
                                    </p>
                                    <div className="flex justify-center space-x-3">
                                        <button
                                            onClick={() => setShowConfirmDelete(null)}
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(Number(showConfirmDelete))}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notification */}
                    {notification && (
                        <div className="fixed bottom-4 right-4 bg-white text-gray-800 px-6 py-3 rounded-lg shadow-lg animate-fade-in flex items-center">
                            <span className="mr-2">{notification}</span>
                            <button 
                                onClick={() => setNotification(null)}
                                className="ml-2 text-gray-400 hover:text-gray-600"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Loading overlay */}
                    {loading && tasks.length > 0 && (
                        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
                                <div className={`animate-spin rounded-full h-5 w-5 border-b-2 ${currentTheme.border}`}></div>
                                <p>Processing...</p>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // Task Modal Component
        // Task type is now imported from './types'

        type TaskModalProps = {
            task?: Task;
            onClose: () => void;
            onSave: (task: Task) => void;
            title: string;
            theme: {
                primary: string;
                hover: string;
                light: string;
                text: string;
                border: string;
                gradient: string;
                ring: string;
            };
        };

        function TaskModal({ task, onClose, onSave, title, theme }: TaskModalProps) {
            const priorityLabels = {
                1: 'Low',
                2: 'Medium',
                3: 'High'
            };

            const [formData, setFormData] = React.useState({
                title: task?.title || '',
                description: task?.description || '',
                priority: task?.priority || 1,
                dueDate: task?.dueDate || new Date().toISOString().split('T')[0],
                completed: task?.completed || false
            });
            
            type FormErrors = {
                title?: string;
                dueDate?: string;
            };
            const [errors, setErrors] = React.useState<FormErrors>({});
            const [isSubmitting, setIsSubmitting] = React.useState(false);

            const validateForm = () => {
                const errors: FormErrors = {};
                if (!formData.title || formData.title.trim() === '') {
                    errors.title = 'Title is required.';
                }
                if (
                    !formData.dueDate ||
                    (typeof formData.dueDate === 'string' && formData.dueDate.trim() === '')
                ) {
                    errors.dueDate = 'Due date is required.';
                }
                setErrors(errors);
                return Object.keys(errors).length === 0;
            };

            const handleChange = (
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
                const target = e.target as HTMLInputElement;
                const { name, value, type, checked } = target;
                setFormData(prev => ({
                    ...prev,
                    [name]: type === 'checkbox' ? checked : value
                }));
                
                // Clear error when field is edited
                if (errors[name as keyof typeof errors]) { /* empty */ }
                setErrors(errors);
                return Object.keys(errors).length === 0;
            };

            const handleSubmit = (e: { preventDefault: () => void; }) => {
                e.preventDefault();
                if (validateForm()) {
                    setIsSubmitting(true);
                    // Simulate a slight delay for better UX
                    setTimeout(() => {
                        onSave({
                            ...formData,
                            id: task?.id,
                            priority: formData.priority,
                            priorityDisplay: 'Low'
                        });
                        setIsSubmitting(false);
                    }, 400);
                }
            };

            // Handle click outside to close
            const modalRef = React.useRef<HTMLDivElement>(null);
            React.useEffect(() => {
                function handleClickOutside(event: MouseEvent) {
                    if (modalRef.current && event.target instanceof Node && !modalRef.current.contains(event.target)) {
                        onClose();
                    }
                }
                document.addEventListener("mousedown", handleClickOutside);
                return () => {
                    document.removeEventListener("mousedown", handleClickOutside);
                };
            }, [onClose]);

            // Handle escape key to close
            React.useEffect(() => {
                function handleEscapeKey(event: { key: string; }) {
                    if (event.key === 'Escape') {
                        onClose();
                    }
                }
                document.addEventListener('keydown', handleEscapeKey);
                return () => {
                    document.removeEventListener('keydown', handleEscapeKey);
                };
            }, [onClose]);

            return (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div ref={modalRef} className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fade-in">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                                <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors duration-200">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="px-6 py-4">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                            Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none ${theme.ring} focus:border-indigo-500 transition-colors duration-200`}
                                            placeholder="Enter task title"
                                        />
                                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={3}
                                            value={formData.description}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none ${theme.ring} focus:border-indigo-500 transition-colors duration-200`}
                                            placeholder="Enter task description (optional)"
                                        ></textarea>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                                            Priority
                                        </label>
                                        <div className="mt-1 flex space-x-3">
                                            {(Object.entries(priorityLabels) as unknown as [keyof typeof priorityLabels, string][]).map(
                                                ([priorityValue, priorityLabel]: [keyof typeof priorityLabels, string]) => (
                                                    <label key={priorityValue} className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="priority"
                                                            value={priorityValue}
                                                            checked={formData.priority === Number(priorityValue)}
                                                            onChange={handleChange}
                                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700 capitalize">
                                                            {priorityLabel}
                                                        </span>
                                                    </label>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                                            Due Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            id="dueDate"
                                            name="dueDate"
                                            value={
                                                typeof formData.dueDate === 'string'
                                                    ? formData.dueDate
                                                    : formData.dueDate instanceof Date
                                                        ? formData.dueDate.toISOString().split('T')[0]
                                                        : ''
                                            }
                                            onChange={handleChange}
                                            className={`mt-1 block w-full border ${errors.dueDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none ${theme.ring} focus:border-indigo-500 transition-colors duration-200`}
                                        />
                                        {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
                                    </div>
                                    
                                    {task && (
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="completed"
                                                name="completed"
                                                checked={formData.completed}
                                                onChange={handleChange}
                                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
                                            />
                                            <label htmlFor="completed" className="ml-2 block text-sm text-gray-700">
                                                Mark as completed
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${theme.primary} ${theme.hover} focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme.ring} transition-colors duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {task ? 'Updating...' : 'Adding...'}
                                        </span>
                                    ) : (
                                        <span>{task ? 'Update Task' : 'Add Task'}</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        }

export default App;

