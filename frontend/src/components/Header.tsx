import React from 'react';
import type { Theme } from '../types';

interface HeaderProps {
    currentTheme: Theme;
    isSearchFocused: boolean;
    setIsSearchFocused: (v: boolean) => void;
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    setShowAddModal: (v: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
    currentTheme,
    isSearchFocused,
    setIsSearchFocused,
    searchTerm,
    setSearchTerm,
    setShowAddModal
}) => (
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
                    <i className="fas fa-magnifying-glass text-gray-400 absolute left-3 top-3"></i>
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className={`${currentTheme.primary} ${currentTheme.hover} text-white font-medium py-2 px-4 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 transform-gpu will-change-transform`}
                    >
                        <i className="fas fa-plus mr-1"></i>
                        Add Task
                    </button>
                </div>
            </div>
        </div>
    </header>
);

export default Header;
