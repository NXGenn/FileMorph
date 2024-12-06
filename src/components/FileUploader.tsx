import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { validateFileType, FileCategory } from '../utils/fileUtils';
import { SUPPORTED_FILE_TYPES } from '../constants/fileTypes';
import toast from 'react-hot-toast';

interface FileUploaderProps {
  category: FileCategory;
  onFileSelect: (files: File[]) => void;
  multiple?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  category,
  onFileSelect,
  multiple = true,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter(file => {
        const isValid = validateFileType(file, category);
        if (!isValid) {
          toast.error(`Invalid file type: ${file.name}`);
        }
        return isValid;
      });

      if (validFiles.length > 0) {
        onFileSelect(validFiles);
      }
    },
    [category, onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
  });

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(
        'w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
        isDragActive
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M24 14v6m0 0v6m0-6h6m-6 0h-6"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag and drop files here, or click to select files'}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Supported formats for {category}: {Object.keys(SUPPORTED_FILE_TYPES[category]).join(', ').toUpperCase()}
        </p>
      </div>
    </motion.div>
  );
};