import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { clsx } from 'clsx';
import { AudioFile } from '../types/audio';

interface DropZoneAudioProps {
    onFileAccepted: (file: AudioFile) => void;
}

export function DropZoneAudio({ onFileAccepted }: DropZoneAudioProps) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'audio/*': ['.mp3', '.wav', '.aac', '.flac', '.ogg']
        },
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file) {
                onFileAccepted({
                    file,
                    name: file.name,
                    size: file.size,
                    type: file.type
                });
            }
        }
    });

    return (
        <div
            {...getRootProps()}
            className={clsx(
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                'hover:border-blue-500 hover:bg-blue-50',
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            )}
        >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg font-medium text-gray-900">
                {isDragActive ? 'Drop the audio file here' : 'Drag & drop an audio file here'}
            </p>
            <p className="mt-2 text-sm text-gray-500">or click to select a file</p>
            <p className="mt-1 text-xs text-gray-400">
                Supported formats: MP3, WAV, AAC, FLAC, OGG
            </p>
        </div>
    );
}