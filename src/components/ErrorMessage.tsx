import React from 'react';

interface ErrorMessageProps {
    error: string | null;
    setError: (v: string | null) => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, setError }) => (
    <>
        {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fade-in">
                <div className="flex items-center">
                    <i className="fas fa-circle-exclamation text-red-500 mr-2"></i>
                    <p className="text-red-700">{error}</p>
                </div>
                <button 
                    onClick={() => setError(null)}
                    className="mt-2 text-sm text-red-700 hover:text-red-900 font-medium"
                >
                    Dismiss
                </button>
            </div>
        )}
    </>
);

export default ErrorMessage;
