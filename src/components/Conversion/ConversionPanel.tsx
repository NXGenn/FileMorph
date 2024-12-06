import React from 'react';
import { FileType, FileCategory } from '../../utils/fileUtils';
import { FileUploader } from '../FileUploader';
import { ConversionOptions } from '../ConversionOptions';

interface ConversionPanelProps {
  category: FileCategory;
  selectedFiles: File[];
  onFileSelect: (files: File[]) => void;
  onFormatSelect: (format: FileType) => void;
  onConvert: () => void;
}

export const ConversionPanel: React.FC<ConversionPanelProps> = ({
  category,
  selectedFiles,
  onFileSelect,
  onFormatSelect,
  onConvert,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <FileUploader 
        category={category}
        onFileSelect={onFileSelect}
      />

      {selectedFiles.length > 0 && (
        <>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Selected Files ({selectedFiles.length}):
            </h3>
            <ul className="mt-2 space-y-2">
              {selectedFiles.map((file, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  {file.name}
                </li>
              ))}
            </ul>
          </div>

          <ConversionOptions
            sourceFile={selectedFiles[0]}
            category={category}
            onFormatSelect={onFormatSelect}
          />

          <button
            onClick={onConvert}
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Start Conversion
          </button>
        </>
      )}
    </div>
  );
};