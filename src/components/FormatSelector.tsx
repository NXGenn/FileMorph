import React from 'react';
import { Select } from './ui/Select';
import { DOCUMENT_FORMATS } from '../utils/document-formats';
import { 
  VIDEO_FORMATS, 
  AUDIO_FORMATS,
  SUPPORTED_VIDEO_CONVERSIONS,
  SUPPORTED_AUDIO_CONVERSIONS 
} from '../types/conversion';

interface FormatSelectorProps {
  conversionType: 'document' | 'video' | 'audio';
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
  const formats = 
    conversionType === 'document' ? DOCUMENT_FORMATS : 
    conversionType === 'audio' ? AUDIO_FORMATS :
    VIDEO_FORMATS;

  const supportedConversions = 
    conversionType === 'document' 
      ? Object.entries(formats).map(([key]) => key)
      : conversionType === 'audio'
      ? Object.keys(SUPPORTED_AUDIO_CONVERSIONS).map(key => {
          const [source, target] = key.split('-');
          return { source, target };
        })
      : Object.keys(SUPPORTED_VIDEO_CONVERSIONS).map(key => {
          const [source, target] = key.split('-');
          return { source, target };
        });

  const getTargetFormats = (source: string) => {
    if (conversionType === 'document') {
      return Object.entries(formats)
        .filter(([key]) => key !== source)
        .map(([key, value]) => ({
          value: key,
          label: value.label
        }));
    } else {
      const conversions = Array.isArray(supportedConversions) 
        ? supportedConversions 
        : Object.keys(supportedConversions).map(key => {
            const [s, t] = key.split('-');
            return { source: s, target: t };
          });

      return conversions
        .filter(conv => conv.source === source)
        .map(conv => ({
          value: conv.target,
          label: formats[conv.target as keyof typeof formats].label
        }));
    }
  };

  const sourceFormats = Object.entries(formats).map(([key, value]) => ({
    value: key,
    label: value.label
  }));

  const targetFormats = getTargetFormats(sourceFormat);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Source Format
        </label>
        <Select
          value={sourceFormat}
          onChange={(e) => {
            const newSource = e.target.value;
            onSourceFormatChange(newSource);
            // Reset target format if not available for new source
            const validTargets = getTargetFormats(newSource);
            if (!validTargets.find(t => t.value === targetFormat)) {
              onTargetFormatChange(validTargets[0]?.value || '');
            }
          }}
          options={sourceFormats}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Format
        </label>
        <Select
          value={targetFormat}
          onChange={(e) => onTargetFormatChange(e.target.value)}
          options={targetFormats}
          disabled={targetFormats.length === 0}
        />
        {targetFormats.length === 0 && (
          <p className="mt-1 text-sm text-red-500">
            No supported target formats for this source format
          </p>
        )}
      </div>
    </div>
  );
};