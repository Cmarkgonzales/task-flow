
import { useEffect, useRef, useState, useCallback } from 'react';
import { fetchAllTasks, addTask, updateTask, deleteTask } from './api/taskService';
import type { Task, TaskParams, ThemeName } from './types/index';
import { themeColors } from './constants/index';

import Header from './components/Header';
import TaskModal from './components/TaskModal';
import DashboardStats from './components/DashBoardStats';
import TaskList from './components/TaskList';
import ThemeSelector from './components/ThemeSelector';
import FilterSortControls from './components/FilterSortControls';
import ErrorMessage from './components/ErrorMessage';
import Notification from './components/Notification';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState('dueDate');
    const [sortOrder, setSortOrder] = useState('desc');
    const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [theme, setTheme] = useState<ThemeName>('indigo');
    const currentTheme = themeColors[theme];

    const fetchTasks = useCallback(async (sort: string = '', status: string = 'all', search: string = '') => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000)); // debounce

            const queryParams: TaskParams = {};
            if (sort) queryParams.sort = sort;
            if (status !== 'all') queryParams.status = status;
            if (search) queryParams.search = search;
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
    }, []);

    const handleSorting = async (sort: string) => {
        const [sortBy, sortOrder] = sort.split('-');
        setSortBy(sortBy);
        setSortOrder(sortOrder);
        setTasks([]); // Clear tasks while sorting
        await fetchTasks(sort, filter);
    };

    const handleFilterChange = async (newFilter: string) => {
        setFilter(newFilter);
        setTasks([]); // Clear tasks while filtering
        await fetchTasks(sortBy + '-' + sortOrder, newFilter);
    };

    const handleSearchChange = async (search: string) => {
        setSearchTerm(search);
        setTasks([]);
        await fetchTasks(sortBy + '-' + sortOrder, filter, searchTerm);
    };

    const debouncedFetch = useCallback((search: string) => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            fetchTasks(`${sortBy}-${sortOrder}`, filter, search.trim());
        }, 300);
    }, [fetchTasks, sortBy, sortOrder, filter]);

    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks(`${sortBy}-${sortOrder}`, filter);
    }, [fetchTasks, sortBy, sortOrder, filter]);

    useEffect(() => {
        debouncedFetch(searchTerm);
    }, [searchTerm, debouncedFetch]);

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
                setSearchTerm={handleSearchChange}
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
        </div>
    );
}

export default App;

