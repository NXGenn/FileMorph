import React, { useState, useCallback } from 'react';
import { DropZone } from '../components/DropZone';
import { FormatSelector } from '../components/FormatSelector';
import { Button } from '../components/ui/Button';
import { Video } from 'lucide-react';
import { convertVideo, extractAudioFromVideo } from '../utils/media-converter';
import { VideoFormat } from '../types/conversion';
import { FileWithPreview } from '../types';
import { saveAs } from 'file-saver';

export const VideoConverter: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [sourceFormat, setSourceFormat] = useState<VideoFormat>('mp4');
  const [targetFormat, setTargetFormat] = useState<VideoFormat>('avi');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [extractAudio, setExtractAudio] = useState(false);

  const handleFilesDrop = useCallback((newFiles: FileWithPreview[]) => {
    setFiles(newFiles);
    setError(null);
  }, []);

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select at least one video file');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const file = files[0];
      let result: Blob;

      if (extractAudio) {
        result = await extractAudioFromVideo(file);
        saveAs(result, 'extracted-audio.mp3');
      } else {
        result = await convertVideo(file, targetFormat);
        saveAs(result, `converted.${targetFormat}`);
      }

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
        <h1 className="text-3xl font-bold text-gray-900">Video Converter</h1>
        <p className="mt-2 text-gray-600">
          Convert videos between formats or extract audio
        </p>
      </div>

      <div className="space-y-6">
        <DropZone 
          onFilesDrop={handleFilesDrop}
          acceptedFileTypes=".mp4,.avi,.mkv,.mov,.webm"
          maxFileSize={500 * 1024 * 1024} // 500MB
          maxFiles={1}
        />

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Conversion Settings</h2>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={extractAudio}
                onChange={(e) => setExtractAudio(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Extract audio (MP3)</span>
            </label>

            {!extractAudio && (
              <FormatSelector
                conversionType="video"
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                onSourceFormatChange={(format) => setSourceFormat(format as VideoFormat)}
                onTargetFormatChange={(format) => setTargetFormat(format as VideoFormat)}
              />
            )}
          </div>
        </div>

        {files.length > 0 && (
          <div className="flex justify-center">
            <Button
              onClick={handleConvert}
              isLoading={status === 'loading'}
              className="w-full max-w-md"
            >
              <Video className="w-4 h-4 mr-2" />
              {extractAudio ? 'Extract Audio' : 'Convert Video'}
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
              {extractAudio ? 'Audio extracted successfully!' : 'Video converted successfully!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};