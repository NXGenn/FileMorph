import React from 'react';
import { ConversionJob } from '../types';
import { ProgressBar } from './ProgressBar';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface JobListProps {
  jobs: ConversionJob[];
  onRemoveJob: (id: string) => void;
}

export const JobList: React.FC<JobListProps> = ({ jobs, onRemoveJob }) => {
  if (jobs.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">
        Conversion Queue
      </h2>
      {jobs.map((job) => (
        <div
          key={job.id}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-4"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex-1">
              <span className="font-medium text-gray-900 dark:text-white">
                {job.sourceFile.name}
              </span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                → {job.targetFormat.toUpperCase()}
              </span>
            </div>
            <button
              onClick={() => onRemoveJob(job.id)}
              className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <ProgressBar progress={job.progress} />
          <div className="mt-2 text-sm">
            {job.status === 'failed' ? (
              <span className="text-red-500 dark:text-red-400">
                {job.error || 'Conversion failed'}
              </span>
            ) : (
              <span className={`
                ${job.status === 'completed' ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}
              `}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)} - {job.progress}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};