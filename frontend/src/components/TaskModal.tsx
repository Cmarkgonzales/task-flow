import React from "react";
import type { Theme, Task, FormErrors } from '../types/index';

type TaskModalProps = {
    task?: Task;
    onClose: () => void;
    onSave: (task: Task) => void;
    title: string;
    theme: Theme;
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
        dueDate: task?.dueDate || new Date().toISOString().split('T')[0], // Default to today
        completed: task?.completed || false
    });

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const { name, value, type } = e.target;
            const checked = (e.target instanceof HTMLInputElement) ? e.target.checked : undefined;

            setFormData(prev => ({
                ...prev,
                [name]:
                    type === 'checkbox'
                        ? checked
                        : name === 'priority'
                        ? Number(value)
                        : value,
            }));

            // Clear the field-specific error (if any)
            if (errors[name as keyof typeof errors]) {
                setErrors(prev => ({ ...prev, [name]: undefined }));
            }
    };

    function getPriorityDisplay(priority: number): 'Low' | 'Medium' | 'High' {
        switch (priority) {
            case 1: return 'Low';
            case 2: return 'Medium';
            case 3: return 'High';
            default: return 'Low'; // fallback
        }
    }

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
                    priorityDisplay: getPriorityDisplay(formData.priority),
                    dueDate: (() => {
                        const date = new Date(formData.dueDate);
                        date.setHours(23, 59, 59, 999); // Local end of day
                        return date;
                    })(),
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
        <div className={`fixed inset-0 ${theme.light} flex items-center justify-center p-4 z-50`}>
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
                                    {Object.entries(priorityLabels).map(
                                        ([priorityValue, priorityLabel]) => (
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

export default TaskModal;
