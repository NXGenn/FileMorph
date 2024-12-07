import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  onFileChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
  fileType?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileChange, 
  accept, 
  maxSize,
  fileType = 'file'
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileChange(acceptedFiles[0]);
    }
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: accept ? accept.split(',').reduce((acc, curr) => {
      // Convert file extensions to MIME types
      const mimeType = {
        '.mp4': 'video/mp4',
        '.avi': 'video/x-msvideo',
        '.mkv': 'video/x-matroska',
        '.mov': 'video/quicktime',
        '.webm': 'video/webm'
      }[curr] || curr;
      return { ...acc, [mimeType]: [] };
    }, {}) : undefined,
    maxSize,
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center space-y-2">
        <Upload className="w-8 h-8 text-gray-400" />
        <div className="text-sm text-gray-600">
          {isDragActive ? (
            <p>Drop the video here</p>
          ) : (
            <>
              <p className="font-medium">Click to upload or drag and drop</p>
              <p>Only video files are allowed</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
