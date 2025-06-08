import React from "react";
import type { Theme } from '../types/index';

interface DashboardStatsProps {
    currentTheme: Theme;
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    upcomingTasks: number;
    overdueTasks: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
    currentTheme,
    totalTasks,
    completedTasks,
    completionRate,
    upcomingTasks,
    overdueTasks
}) => (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center animate-fade-in">
            <div className={`w-12 h-12 flex items-center justify-center rounded-full ${currentTheme.light} mr-4`}>
                <i className={`fa-regular fa-clipboard ${currentTheme.text} text-2xl`}></i>
            </div>
            <div>
                <p className="text-sm text-gray-500">Total Tasks</p>
                <p className="text-xl font-semibold">{totalTasks}</p>
            </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-50 mr-4">
                <i className="fa-solid fa-check text-green-500 text-2xl"></i>
            </div>
            <div>
                <p className="text-sm text-gray-500">Completed</p>
                <div className="flex items-center">
                    <p className="text-xl font-semibold">{completedTasks}</p>
                    <p className="ml-2 text-sm text-green-500">({completionRate}%)</p>
                </div>
            </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 mr-4">
                <i className="fa-regular fa-clock text-blue-500 text-2xl"></i>
            </div>
            <div>
                <p className="text-sm text-gray-500">Upcoming</p>
                <p className="text-xl font-semibold">{upcomingTasks}</p>
            </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-50 mr-4">
                <i className="fas fa-triangle-exclamation text-amber-500 text-2xl"></i>
            </div>
            <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-xl font-semibold">{overdueTasks}</p>
            </div>
        </div>
    </div>
);

export default DashboardStats;
