import React from 'react';
import { ConversionType } from '../types/conversion';
import { FileType, Video, Music, FileText, Image } from 'lucide-react';

interface ConversionTypeSelectorProps {
  value: ConversionType;
  onChange: (type: ConversionType) => void;
}

export const ConversionTypeSelector: React.FC<ConversionTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  const types: { value: ConversionType; label: string; icon: React.FC }[] = [
    { value: 'document', label: 'Documents', icon: FileType },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'audio', label: 'Audio', icon: Music },
    { value: 'text', label: 'Text', icon: FileText },
    { value: 'image', label: 'Images', icon: Image },
  ];

  return (
    <div className="flex space-x-4">
      {types.map((type) => {
        const Icon = type.icon;
        return (
          <button
            key={type.value}
            onClick={() => onChange(type.value)}
            className={`flex flex-col items-center p-4 rounded-lg transition-colors ${
              value === type.value
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">{type.label}</span>
          </button>
        );
      })}
    </div>
  );
};