import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { FileWithPreview } from '../types';

interface DropZoneProps {
  onFilesDrop: (files: FileWithPreview[]) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFilesDrop }) => {
  const processFiles = useCallback(
    (rawFiles: File[]) => {
      const validFiles = rawFiles.filter(file => 
        file.type.startsWith('image/')
      ).map(file => {
        const preview = URL.createObjectURL(file);
        return Object.assign(file, { preview }) as FileWithPreview;
      });
      
      if (validFiles.length > 0) {
        onFilesDrop(validFiles);
      }
    },
    [onFilesDrop]
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
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
    >
      <input
        type="file"
        multiple
        accept="image/*"
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
          Drag and drop your images here
        </p>
        <p className="text-sm text-gray-500 mt-2">
          or click to select files
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Supports JPG, PNG, GIF, and WEBP
        </p>
      </label>
    </div>
  );
};