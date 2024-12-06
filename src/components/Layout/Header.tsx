import React from 'react';
import { ThemeToggle } from '../ThemeToggle';

export const Header: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        FileMorph
      </h1>
      <ThemeToggle />
    </div>
  );
};