import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { FileWithPreview } from '../types';
import { isValidFileType, formatFileSize } from '../utils/file-types';

interface DropZoneProps {
  onFilesDrop: (files: FileWithPreview[]) => void;
  acceptedFileTypes: string;
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  onError?: (errors: string[]) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFilesDrop,
  acceptedFileTypes,
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  maxFiles = 20,
  onError,
}) => {
  const validateFiles = (files: File[]): { valid: FileWithPreview[], errors: string[] } => {
    const validFiles: FileWithPreview[] = [];
    const errors: string[] = [];

    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} file${maxFiles === 1 ? '' : 's'} allowed`);
      return { valid: [], errors };
    }

    for (const file of files) {
      // Check file type
      if (!isValidFileType(file, acceptedFileTypes)) {
        errors.push(`Invalid file type: ${file.name}`);
        continue;
      }

      // Check file size
      if (file.size > maxFileSize) {
        errors.push(`File too large: ${file.name} (max: ${formatFileSize(maxFileSize)})`);
        continue;
      }

      // Create preview URL for valid files
      const preview = URL.createObjectURL(file);
      validFiles.push(Object.assign(file, { preview }) as FileWithPreview);
    }

    return { valid: validFiles, errors };
  };

  const processFiles = useCallback(
    (rawFiles: File[]) => {
      const { valid, errors } = validateFiles(rawFiles);
      
      if (errors.length > 0) {
        if (onError) {
          onError(errors);
        } else {
          console.error('File validation errors:', errors);
          alert(errors.join('\n'));
        }
      }
      
      if (valid.length > 0) {
        onFilesDrop(valid);
      }
    },
    [onFilesDrop, acceptedFileTypes, maxFileSize, maxFiles, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    },
    [processFiles]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  };

  const getAcceptedTypesMessage = () => {
    const types = acceptedFileTypes.split(',').map(type => 
      type.trim().replace('*', '').toUpperCase()
    );
    return types.join(', ');
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
    >
      <input
        type="file"
        multiple={maxFiles > 1}
        accept={acceptedFileTypes}
        onChange={handleFileInput}
        className="hidden"
        id="file-input"
      />
      <label
        htmlFor="file-input"
        className="cursor-pointer flex flex-col items-center"
      >
        <Upload className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700">
          Drag and drop your file{maxFiles > 1 ? 's' : ''} here
        </p>
        <p className="text-sm text-gray-500 mt-2">
          or click to select file{maxFiles > 1 ? 's' : ''}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Supports {getAcceptedTypesMessage()}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Max size: {formatFileSize(maxFileSize)}
        </p>
        {maxFiles > 1 && (
          <p className="text-xs text-gray-400 mt-1">
            Max files: {maxFiles}
          </p>
        )}
      </label>
    </div>
  );
};