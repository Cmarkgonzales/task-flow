import axios from 'axios';
import type { Task, TaskParams } from '../types';

const API_URL = import.meta.env.VITE_API_URL;
const API = API_URL ? `${API_URL}/api/tasks` : null;
const useMock = !API_URL;

// --- API METHODS ---

export const fetchAllTasks = async (params?: TaskParams): Promise<{ data: Task[] }> => {
    if (useMock) {
        const res = await fetch('/tasks.json');
        const data = await res.json();
        return { data };
    }

    try {
        const res = await axios.get<Task[]>(API!, { params });
        return { data: res.data };
    } catch (err) {
        console.warn('API request failed, falling back to tasks.json', err);
        const res = await fetch('/tasks.json');
        const data = await res.json();
        return { data };
    }
};

export const addTask = async (task: Task): Promise<{ data: Task }> => {
    if (useMock) throw new Error('Mock API: addTask not available without backend');
    const res = await axios.post<Task>(API!, task);
    return { data: res.data };
};

export const updateTask = async (id: number, task: Task): Promise<{ data: Task }> => {
    if (useMock) throw new Error('Mock API: updateTask not available without backend');
    const res = await axios.put<Task>(`${API}/${id}`, task);
    return { data: res.data };
};

export const deleteTask = async (id: number): Promise<{ data: { id: number } }> => {
    if (useMock) throw new Error('Mock API: deleteTask not available without backend');
    await axios.delete(`${API}/${id}`);
    return { data: { id } };
};
