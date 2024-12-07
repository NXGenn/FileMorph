import React from 'react';
import { FileAudio, X } from 'lucide-react';
import { AudioFile } from '../types/audio';

interface FileInfoProps {
    file: AudioFile;
    onRemove: () => void;
}

export function FileInfo({ file, onRemove }: FileInfoProps) {
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
                <FileAudio className="h-8 w-8 text-blue-500" />
                <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                </div>
            </div>
            <button
                onClick={onRemove}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
                <X className="h-5 w-5 text-gray-500" />
            </button>
        </div>
    );
}