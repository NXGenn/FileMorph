import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useStore } from '../store/useStore';

export const ThemeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useStore();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      {darkMode ? (
        <SunIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      )}
    </button>
  );
};