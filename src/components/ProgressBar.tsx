import React from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
    progress: number;
    timeRemaining: number;
}

export function ProgressBar({ progress, timeRemaining }: ProgressBarProps) {
    return (
        <div className="w-full">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{Math.round(progress)}%</span>
                <span>{timeRemaining > 0 ? `${Math.ceil(timeRemaining)}s remaining` : ''}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className={clsx(
                        'h-2.5 rounded-full transition-all duration-300',
                        'bg-blue-600'
                    )}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}