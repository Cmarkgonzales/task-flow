import React from "react";

interface NotificationProps {
    notification: string | null;
    setNotification: (v: string | null) => void;
}

const Notification: React.FC<NotificationProps> = ({ notification, setNotification }) => (
    <>
        {notification && (
            <div className="fixed bottom-4 right-4 bg-white text-gray-800 px-6 py-3 rounded-lg shadow-lg animate-fade-in flex items-center">
                <span className="mr-2">{notification}</span>
                <button 
                    onClick={() => setNotification(null)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        )}
    </>
);

export default Notification;
