// src/types.ts
export interface Task {
  dueDate: string | number | Date;
  id?: number;
  title: string;
  description: string;
  priority: number,
  priorityDisplay: 'Low' | 'Medium' | 'High';
  completed: boolean;
}

export interface TaskParams {
  sort?: string;
  status?: string;
}
