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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            {/* Left Logo & Title */}
            <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl">
                    <i className={`fa-solid fa-list-check text-2xl sm:text-4xl ${currentTheme.text}`} />
                </div>
                <h1 className="ml-2 text-xl sm:text-2xl font-bold text-gray-900">TaskFlow</h1>
            </div>

            {/* Right Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                {/* Search Field */}
                <div className={`relative transition-all duration-300 w-full sm:w-64 ${isSearchFocused ? 'sm:w-72' : ''}`}>
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

                {/* Add Task Button */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className={`${currentTheme.primary} ${currentTheme.hover} text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105`}
                >
                    <i className="fas fa-plus mr-1"></i>
                    <span className="hidden sm:inline">Add Task</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </div>
        </div>
    </header>
);

export default Header;
