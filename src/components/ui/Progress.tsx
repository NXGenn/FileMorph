import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ProgressProps {
  value: number;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className }) => {
  return (
    <div className={twMerge("w-full bg-gray-200 rounded-full h-2.5", className)}>
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${Math.min(Math.max(0, value), 100)}%` }}
      />
    </div>
  );
};
