import React from 'react';
import { ConversionType } from '../types/conversion';

interface FormatSelectorProps {
  conversionType: ConversionType;
  sourceFormat: string;
  targetFormat: string;
  onSourceFormatChange: (format: string) => void;
  onTargetFormatChange: (format: string) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  conversionType,
  sourceFormat,
  targetFormat,
  onSourceFormatChange,
  onTargetFormatChange,
}) => {
  const getFormats = (type: ConversionType) => {
    switch (type) {
      case 'document':
        return ['pdf', 'docx', 'xlsx', 'pptx', 'epub'];
      case 'video':
        return ['mp4', 'avi', 'mkv', 'mov'];
      case 'audio':
        return ['mp3', 'wav', 'aac', 'flac'];
      case 'text':
        return ['json', 'xml', 'yaml', 'txt'];
      case 'image':
        return ['jpeg', 'png', 'gif', 'webp'];
      default:
        return [];
    }
  };

  const formats = getFormats(conversionType);

  return (
    <div className="flex items-center space-x-4">
      <select
        value={sourceFormat}
        onChange={(e) => onSourceFormatChange(e.target.value)}
        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {formats.map((format) => (
          <option key={format} value={format}>
            {format.toUpperCase()}
          </option>
        ))}
      </select>
      <span className="text-gray-500">to</span>
      <select
        value={targetFormat}
        onChange={(e) => onTargetFormatChange(e.target.value)}
        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {formats.map((format) => (
          <option key={format} value={format}>
            {format.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};