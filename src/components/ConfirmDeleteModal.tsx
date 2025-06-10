import React from 'react';
import type { Theme } from '../types';

interface ConfirmDeleteModalProps {
    setShowConfirmDelete: (v: string | null) => void;
    handleDeleteTask: (id: number) => void;
    showConfirmDelete: string;
    currentTheme: Theme;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    setShowConfirmDelete,
    handleDeleteTask,
    showConfirmDelete,
    currentTheme
}) => (
    <div className={`fixed inset-0 ${currentTheme.light} flex items-center justify-center p-4 z-50`}>
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fade-in">
            <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full p-3">
                        <i className="fa-regular fa-trash-can text-red-500 text-2xl"></i>
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
);

export default ConfirmDeleteModal;
