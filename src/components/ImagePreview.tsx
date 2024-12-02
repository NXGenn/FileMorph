import React from 'react';
import { X } from 'lucide-react';
import { FileWithPreview } from '../types';

interface ImagePreviewProps {
  files: FileWithPreview[];
  onRemove: (index: number) => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ files, onRemove }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
      {files.map((file, index) => (
        <div
          key={file.preview}
          className="relative group rounded-lg overflow-hidden border border-gray-200"
        >
          <img
            src={file.preview}
            alt={file.name}
            className="w-full h-40 object-cover"
          />
          <button
            onClick={() => onRemove(index)}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 truncate">
            {file.name}
          </div>
        </div>
      ))}
    </div>
  );
};