import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { DropZoneAudio } from '../components/DropZoneAudio.tsx';
import { FormatSelectorAudio } from '../components/FormatSelectorAudio.tsx';
import { ProgressBar } from '../components/ProgressBar.tsx';
import { FileInfo } from '../components/FileInfo.tsx';
import { convertAudio } from '../utils/audioConverter.ts';
import { AudioFile, AudioFormat, ConversionProgress } from '../types/audio.ts';

export const AudioConverter: React.FC = () =>  {
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [targetFormat, setTargetFormat] = useState<AudioFormat>('mp3');
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState<ConversionProgress>({ percentage: 0, timeRemaining: 0 });
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConversion = async () => {
    if (!audioFile) return;

    setConverting(true);
    setError(null);
    setConvertedBlob(null);

    try {
      const converted = await convertAudio(
          audioFile.file,
          targetFormat,
          (percentage, timeRemaining) => setProgress({ percentage, timeRemaining })
      );
      setConvertedBlob(converted);
    } catch (err) {
      setError('An error occurred during conversion. Please try again.');
    } finally {
      setConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedBlob || !audioFile) return;

    const url = URL.createObjectURL(convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${audioFile.name.split('.')[0]}.${targetFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Audio File Converter
            </h1>

            {!audioFile ? (
                <DropZoneAudio onFileAccepted={setAudioFile} />
            ) : (
                <FileInfo file={audioFile} onRemove={() => setAudioFile(null)} />
            )}

            {audioFile && (
                <div className="space-y-4">
                  <FormatSelectorAudio
                      selectedFormat={targetFormat}
                      onFormatChange={setTargetFormat}
                      disabled={converting}
                  />

                  {!convertedBlob && !converting && (
                      <button
                          onClick={handleConversion}
                          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                           transition-colors"
                      >
                        Convert to {targetFormat.toUpperCase()}
                      </button>
                  )}

                  {converting && (
                      <ProgressBar
                          progress={progress.percentage}
                          timeRemaining={progress.timeRemaining}
                      />
                  )}

                  {convertedBlob && (
                      <button
                          onClick={handleDownload}
                          className="w-full py-2 px-4 bg-green-600 text-white rounded-md
                           hover:bg-green-700 focus:outline-none focus:ring-2
                           focus:ring-green-500 focus:ring-offset-2 transition-colors
                           flex items-center justify-center space-x-2"
                      >
                        <Download className="h-5 w-5" />
                        <span>Download Converted File</span>
                      </button>
                  )}

                  {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                  )}
                </div>
            )}
          </div>
        </div>
      </div>
  );
}
