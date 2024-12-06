import React from 'react';
import { FileType, getTargetFormats } from '../utils/fileUtils';
import { FILE_TYPE_EXTENSIONS } from '../constants/fileTypes';
import type { FileCategory } from '../utils/fileUtils';

interface ConversionOptionsProps {
  sourceFile: File;
  category: FileCategory;
  onFormatSelect: (format: FileType) => void;
}

export const ConversionOptions: React.FC<ConversionOptionsProps> = ({
  sourceFile,
  category,
  onFormatSelect,
}) => {
  const targetFormats = getTargetFormats(sourceFile, category);

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Convert to:
      </label>
      <select
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        onChange={(e) => onFormatSelect(e.target.value as FileType)}
        defaultValue=""
      >
        <option value="" disabled>Select format</option>
        {targetFormats.map((format) => (
          <option key={format} value={format}>
            {format.toUpperCase()} ({FILE_TYPE_EXTENSIONS[format]})
          </option>
        ))}
      </select>
    </div>
  );
};