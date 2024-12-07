import React, { useState, useEffect } from 'react';
import { FileUploader } from '../components/FileUploader';
import { FormatSelector } from '../components/FormatSelector';
import { convertVideo, extractAudioFromVideo } from '../utils/media-converter';
import { VideoFormat } from '../types/conversion';
import { Progress } from '../components/ui/Progress';

// Maximum file size: 500MB
const MAX_FILE_SIZE = 500 * 1024 * 1024;
const SUPPORTED_FORMATS = ['mp4', 'avi', 'mkv', 'mov', 'webm'];

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const validateVideoFile = (file: File): ValidationResult => {
  if (!file) {
    return { isValid: false, error: 'Please select a file' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  if (!SUPPORTED_FORMATS.includes(extension)) {
    return {
      isValid: false,
      error: `Unsupported file format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`
    };
  }

  const validMimeTypes = [
    'video/mp4',
    'video/x-msvideo',
    'video/x-matroska',
    'video/quicktime',
    'video/webm'
  ];
  
  if (!validMimeTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid video file type'
    };
  }

  return { isValid: true };
};

export const VideoConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [sourceFormat, setSourceFormat] = useState<string>('mp4');
  const [targetFormat, setTargetFormat] = useState<string>('avi');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isValidFile, setIsValidFile] = useState(false);

  useEffect(() => {
    if (file) {
      const validation = validateVideoFile(file);
      setIsValidFile(validation.isValid);
      setError(validation.error || null);

      if (validation.isValid) {
        const extension = file.name.split('.').pop()?.toLowerCase() || '';
        if (SUPPORTED_FORMATS.includes(extension)) {
          setSourceFormat(extension);
        }
      }
    } else {
      setIsValidFile(false);
      setError(null);
    }
  }, [file]);

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    setProgress(0);
  };

  const handleConvert = async () => {
    if (!file || !isValidFile) {
      setError('Please select a valid video file');
      return;
    }

    setIsConverting(true);
    setError(null);
    setProgress(0);

    try {
      // Faster progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 85) {
            return prev;
          }
          // Faster increments
          return prev + Math.floor(Math.random() * 15 + 5);
        });
      }, 300); // Shorter interval

      let result: Blob;
      if (targetFormat === 'mp3') {
        result = await extractAudioFromVideo(file);
      } else {
        result = await convertVideo(file, targetFormat as VideoFormat);
      }

      clearInterval(progressInterval);
      setProgress(100);

      // Create and trigger download
      const url = URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted_${file.name.split('.')[0]}.${targetFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Reset after successful conversion
      setTimeout(() => {
        setProgress(0);
        setIsConverting(false);
      }, 1500);
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err instanceof Error ? err.message : 'Conversion failed');
      setProgress(0);
      setIsConverting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Video Converter
          </h2>
          <p className="text-gray-600">
            Convert your videos to different formats or extract audio
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Supported formats: {SUPPORTED_FORMATS.join(', ')}
            <br />
            Maximum file size: {MAX_FILE_SIZE / (1024 * 1024)}MB
          </div>
        </div>

        <FileUploader 
          onFileChange={handleFileChange}
          accept="video/mp4,video/x-msvideo,video/x-matroska,video/quicktime,video/webm"
          maxSize={MAX_FILE_SIZE}
          fileType="video"
        />

        {file && isValidFile && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Selected file:</p>
            <p className="font-medium text-gray-900">{file.name}</p>
            <p className="text-sm text-gray-500">
              Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
            <p className="text-sm text-gray-500">
              Type: {file.type}
            </p>
          </div>
        )}

        {isValidFile && (
          <FormatSelector
            conversionType="video"
            sourceFormat={sourceFormat}
            targetFormat={targetFormat}
            onSourceFormatChange={setSourceFormat}
            onTargetFormatChange={setTargetFormat}
          />
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isConverting && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-gray-600 text-center">
              {progress === 100 ? 'Conversion complete!' : `Converting... ${progress}%`}
            </p>
          </div>
        )}

        <button
          onClick={handleConvert}
          disabled={!isValidFile || isConverting || !file}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConverting ? 'Converting...' : 'Convert'}
        </button>
      </div>
    </div>
  );
};