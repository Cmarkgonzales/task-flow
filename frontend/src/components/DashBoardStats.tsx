import React from "react";

interface Theme {
    light: string;
    text: string;
}

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
            <div className={`p-3 rounded-full ${currentTheme.light} mr-4`}>
                <svg className={`h-6 w-6 ${currentTheme.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            </div>
            <div>
                <p className="text-sm text-gray-500">Total Tasks</p>
                <p className="text-xl font-semibold">{totalTasks}</p>
            </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="p-3 rounded-full bg-green-50 mr-4">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
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
            <div className="p-3 rounded-full bg-blue-50 mr-4">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div>
                <p className="text-sm text-gray-500">Upcoming</p>
                <p className="text-xl font-semibold">{upcomingTasks}</p>
            </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="p-3 rounded-full bg-amber-50 mr-4">
                <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-xl font-semibold">{overdueTasks}</p>
            </div>
        </div>
    </div>
);

export default DashboardStats;
