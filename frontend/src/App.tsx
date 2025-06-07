
import React from 'react';
import { fetchAllTasks, addTask, updateTask, deleteTask } from './api/taskService';
import type { Task, TaskParams, ThemeName } from './types/index';

import Header from './components/Header';
import TaskModal from './components/TaskModal';
import DashboardStats from './components/DashBoardStats';
import TaskList from './components/TaskList';
import ThemeSelector from './components/ThemeSelector';
import FilterSortControls from './components/FilterSortControls';
import ErrorMessage from './components/ErrorMessage';
import LoadingOverlay from './components/LoadingOverlay';
import Notification from './components/Notification';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';



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
            const handleAddTask = async (task: Omit<Task, 'id'>) => {
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
                if (typeof task.id !== 'number') {
                    setError("Task ID is missing. Cannot update task.");
                    return;
                }
                try {
                    setLoading(true);
                    const response = await updateTask(task.id, task);
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
                    <Header
                        currentTheme={currentTheme}
                        isSearchFocused={isSearchFocused}
                        setIsSearchFocused={setIsSearchFocused}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        setShowAddModal={setShowAddModal}
                    />

                    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <DashboardStats
                            currentTheme={currentTheme}
                            totalTasks={totalTasks}
                            completedTasks={completedTasks}
                            completionRate={completionRate}
                            upcomingTasks={upcomingTasks}
                            overdueTasks={overdueTasks}
                        />

                        <ThemeSelector
                            themeColors={themeColors}
                            theme={theme}
                            setTheme={setTheme}
                        />

                        <ErrorMessage
                            error={error}
                            setError={setError}
                        />

                        <FilterSortControls
                            filter={filter}
                            handleFilterChange={handleFilterChange}
                            currentTheme={theme}
                            tasks={tasks}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            handleSorting={handleSorting}
                        />

                        <TaskList
                            loading={loading}
                            tasks={tasks}
                            currentTheme={currentTheme}
                            searchTerm={searchTerm}
                            setShowAddModal={setShowAddModal}
                            setEditingTask={setEditingTask}
                            setShowConfirmDelete={setShowConfirmDelete}
                            handleToggleComplete={handleToggleComplete}
                        />
                    </main>

                    {showAddModal && (
                        <TaskModal
                            onClose={() => setShowAddModal(false)}
                            onSave={handleAddTask}
                            title="Add New Task"
                            theme={currentTheme}
                            task={undefined}
                        />
                    )}

                    {editingTask && (
                        <TaskModal
                            task={editingTask}
                            onClose={() => setEditingTask(null)}
                            onSave={handleUpdateTask}
                            title="Edit Task"
                            theme={currentTheme}
                        />
                    )}

                    {showConfirmDelete && (
                        <ConfirmDeleteModal
                            setShowConfirmDelete={setShowConfirmDelete}
                            handleDeleteTask={handleDeleteTask}
                            showConfirmDelete={showConfirmDelete}
                        />
                    )}

                    <Notification
                        notification={notification}
                        setNotification={setNotification}
                    />

                    <LoadingOverlay
                        loading={loading}
                        tasks={tasks}
                        currentTheme={currentTheme}
                    />
                </div>
            );
        }

export default App;

