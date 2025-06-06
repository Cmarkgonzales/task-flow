// src/api/taskService.ts
import axios from 'axios';
import type { Task, TaskParams } from '../types';

const API = 'http://localhost:8085/api/tasks';

export const fetchAllTasks = (params?: TaskParams) =>
  axios.get<Task[]>(API, { params });

export const addTask = (task: Task) => axios.post<Task>(API, task);
export const updateTask = (id: number, task: Task) => axios.put(`${API}/${id}`, task);
export const deleteTask = (id: number) => axios.delete(`${API}/${id}`);
