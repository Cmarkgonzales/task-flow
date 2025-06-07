import React from "react";

interface ErrorMessageProps {
    error: string | null;
    setError: (v: string | null) => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, setError }) => (
    <>
        {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fade-in">
                <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
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
