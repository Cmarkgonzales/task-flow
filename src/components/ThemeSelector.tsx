import React from 'react';
import type { ThemeName, ThemeMap, Theme } from '../types';

interface ThemeSelectorProps {
    themeColors: ThemeMap
    theme: ThemeName;
    setTheme: React.Dispatch<React.SetStateAction<ThemeName>>;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ themeColors, theme, setTheme }) => (
    <div className="mb-6 flex justify-end">
        <div className="bg-white rounded-lg shadow-sm p-2 flex space-x-2">
            {(Object.entries(themeColors) as [ThemeName, Theme][]).map(([colorName, colorTheme]) => {
                const isSelected = theme === colorName;
                const buttonClass = `w-6 h-6 rounded-full ${colorTheme.primary} ${isSelected ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`;

                return (
                    <button
                        key={colorName}
                        onClick={() => setTheme(colorName)}
                        className={buttonClass}
                        aria-label={`${colorName} theme`}
                        title={`${colorName.charAt(0).toUpperCase() + colorName.slice(1)} theme`}
                    />
                );
            })}
        </div>
    </div>
);

export default ThemeSelector;
