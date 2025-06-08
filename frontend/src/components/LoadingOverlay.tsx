import type { Theme } from '../types';

interface LoadingOverlayProps {
    loading: boolean;
    tasks: unknown[];
    currentTheme: Theme;
}

const LoadingOverlay = ({ loading, tasks, currentTheme }: LoadingOverlayProps) => {

    return (
        <>
            {loading && tasks.length > 0 && (
                <div className={`fixed inset-0 ${currentTheme.light} flex items-center justify-center z-50`}>
                    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
                        <div className={`animate-spin rounded-full h-5 w-5 border-b-2 ${currentTheme.border}`}></div>
                        <p>Processing...</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default LoadingOverlay;
