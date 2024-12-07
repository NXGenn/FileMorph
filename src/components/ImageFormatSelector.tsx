import React from 'react';
import { ImageFormat } from '../types';

interface ImageFormatSelectorProps {
  value: ImageFormat;
  onChange: (format: ImageFormat) => void;
}

export const ImageFormatSelector: React.FC<ImageFormatSelectorProps> = ({
  value,
  onChange,
}) => {
  const formats: { value: ImageFormat; label: string }[] = [
    { value: 'image/jpeg', label: 'JPEG' },
    { value: 'image/png', label: 'PNG' },
    { value: 'image/gif', label: 'GIF' },
    { value: 'image/webp', label: 'WebP' },
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ImageFormat)}
      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    >
      {formats.map((format) => (
        <option key={format.value} value={format.value}>
          {format.label}
        </option>
      ))}
    </select>
  );
};