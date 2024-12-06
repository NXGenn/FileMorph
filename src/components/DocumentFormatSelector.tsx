import React from 'react';
import { DocumentFormat } from '../types/conversion';
import { DOCUMENT_FORMATS, SUPPORTED_CONVERSIONS, isConversionSupported } from '../utils/document-formats';

interface DocumentFormatSelectorProps {
  sourceFormat: DocumentFormat;
  targetFormat: DocumentFormat;
  onSourceFormatChange: (format: DocumentFormat) => void;
  onTargetFormatChange: (format: DocumentFormat) => void;
}

export const DocumentFormatSelector: React.FC<DocumentFormatSelectorProps> = ({
  sourceFormat,
  targetFormat,
  onSourceFormatChange,
  onTargetFormatChange,
}) => {
  const formats = Object.entries(DOCUMENT_FORMATS);

  const handleSourceChange = (format: DocumentFormat) => {
    onSourceFormatChange(format);
    // Reset target format if current conversion becomes invalid
    if (!isConversionSupported(format, targetFormat)) {
      onTargetFormatChange(Object.keys(DOCUMENT_FORMATS)[0] as DocumentFormat);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 items-center">
      <select
        value={sourceFormat}
        onChange={(e) => handleSourceChange(e.target.value as DocumentFormat)}
        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {formats.map(([format, info]) => (
          <option key={format} value={format}>
            {info.label}
          </option>
        ))}
      </select>

      <div className="text-center text-gray-500">to</div>

      <select
        value={targetFormat}
        onChange={(e) => onTargetFormatChange(e.target.value as DocumentFormat)}
        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {formats
          .filter(([format]) => isConversionSupported(sourceFormat, format as DocumentFormat))
          .map(([format, info]) => (
            <option key={format} value={format}>
              {info.label}
            </option>
          ))}
      </select>
    </div>
  );
};