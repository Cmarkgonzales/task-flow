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

export type Theme = {
  primary: string;
  hover: string;
  light: string;
  text: string;
  border: string;
  gradient: string;
  ring: string;
};

export type ThemeName = 'indigo' | 'purple' | 'teal' | 'rose';

export type ThemeMap = Record<ThemeName, Theme>;

export type FormErrors = {
    title?: string;
    dueDate?: string;
}
