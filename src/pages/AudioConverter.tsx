import React, { useState, useCallback } from 'react';
import { DropZone } from '../components/DropZone';
import { FormatSelector } from '../components/FormatSelector';
import { Button } from '../components/ui/Button';
import { Music } from 'lucide-react';
import { convertAudio } from '../utils/media-converter';
import { AudioFormat } from '../types/conversion';
import { FileWithPreview } from '../types';
import { saveAs } from 'file-saver';

export const AudioConverter: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [sourceFormat, setSourceFormat] = useState<AudioFormat>('mp3');
  const [targetFormat, setTargetFormat] = useState<AudioFormat>('wav');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleFilesDrop = useCallback((newFiles: FileWithPreview[]) => {
    setFiles(newFiles);
    setError(null);
  }, []);

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select at least one audio file');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const file = files[0];
      const result = await convertAudio(file, targetFormat);
      saveAs(result, `converted.${targetFormat}`);
      setStatus('success');
    } catch (err) {
      console.error('Conversion failed:', err);
      setError(err instanceof Error ? err.message : 'Conversion failed');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Audio Converter</h1>
        <p className="mt-2 text-gray-600">
          Convert between different audio formats
        </p>
      </div>

      <div className="space-y-6">
        <DropZone 
          onFilesDrop={handleFilesDrop}
          acceptedFileTypes=".mp3,.wav,.aac,.flac,.ogg,.m4a"
          maxFileSize={200 * 1024 * 1024} // 200MB
          maxFiles={1}
        />

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Conversion Settings</h2>
          <FormatSelector
            conversionType="audio"
            sourceFormat={sourceFormat}
            targetFormat={targetFormat}
            onSourceFormatChange={(format) => setSourceFormat(format as AudioFormat)}
            onTargetFormatChange={(format) => setTargetFormat(format as AudioFormat)}
          />
        </div>

        {files.length > 0 && (
          <div className="flex justify-center">
            <Button
              onClick={handleConvert}
              isLoading={status === 'loading'}
              className="w-full max-w-md"
            >
              <Music className="w-4 h-4 mr-2" />
              Convert Audio
            </Button>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-700">
              Audio converted successfully!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};