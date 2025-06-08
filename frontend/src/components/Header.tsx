import React from "react";
import type { Theme } from '../types/index';

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
                    <svg className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className={`${currentTheme.primary} ${currentTheme.hover} text-white font-medium py-2 px-4 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105`}
                    >
                        <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Task
                    </button>
                </div>
            </div>
        </div>
    </header>
);

export default Header;
