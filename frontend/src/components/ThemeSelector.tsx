import React from "react";
import type { ThemeName } from '../types/index';


type Theme = {
    [colorName: string]: {
        primary: string;
    };
};

interface ThemeSelectorProps {
    themeColors: Theme,
    theme: ThemeName;
    setTheme: React.Dispatch<React.SetStateAction<ThemeName>>;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ themeColors, theme, setTheme }) => (
    <div className="mb-6 flex justify-end">
        <div className="bg-white rounded-lg shadow-sm p-2 flex space-x-2">
            {Object.keys(themeColors).map(colorName => (
                <button
                    key={colorName}
                    onClick={() => setTheme(colorName as ThemeName)}
                    className={`w-6 h-6 rounded-full ${themeColors[colorName].primary} ${theme === colorName ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                    title={`${colorName.charAt(0).toUpperCase() + colorName.slice(1)} theme`}
                ></button>
            ))}
        </div>
    </div>
);

export default ThemeSelector;
