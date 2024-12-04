import React, { useState, useCallback } from 'react';
import { DropZone } from '../components/DropZone';
import { FormatSelector } from '../components/FormatSelector';
import { Button } from '../components/ui/Button';
import { FileType } from 'lucide-react';
import { convertDocxToPdf, convertPdfToDocx, convertExcelToPdf, convertPdfToExcel } from '../utils/document-converter';
import { DocumentFormat } from '../types/conversion';
import { FileWithPreview } from '../types';
import { saveAs } from 'file-saver';

export const DocumentConverter: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [sourceFormat, setSourceFormat] = useState<DocumentFormat>('pdf');
  const [targetFormat, setTargetFormat] = useState<DocumentFormat>('docx');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleFilesDrop = useCallback((newFiles: FileWithPreview[]) => {
    setFiles(newFiles);
    setError(null);
  }, []);

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const file = files[0];
      let result: Blob;

      switch (`${sourceFormat}-${targetFormat}`) {
        case 'docx-pdf':
          result = await convertDocxToPdf(file);
          break;
        case 'pdf-docx':
          result = await convertPdfToDocx(file);
          break;
        case 'xlsx-pdf':
          result = await convertExcelToPdf(file);
          break;
        case 'pdf-xlsx':
          result = await convertPdfToExcel(file);
          break;
        default:
          throw new Error('Unsupported conversion');
      }

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
        <h1 className="text-3xl font-bold text-gray-900">Document Converter</h1>
        <p className="mt-2 text-gray-600">
          Convert between PDF, Word, Excel, and other document formats
        </p>
      </div>

      <div className="space-y-6">
        <DropZone 
          onFilesDrop={handleFilesDrop}
          acceptedFileTypes=".pdf,.docx,.xlsx,.pptx,.epub"
          maxFileSize={100 * 1024 * 1024} // 100MB
          maxFiles={1}
        />

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Conversion Settings</h2>
          <FormatSelector
            conversionType="document"
            sourceFormat={sourceFormat}
            targetFormat={targetFormat}
            onSourceFormatChange={(format) => setSourceFormat(format as DocumentFormat)}
            onTargetFormatChange={(format) => setTargetFormat(format as DocumentFormat)}
          />
        </div>

        {files.length > 0 && (
          <div className="flex justify-center">
            <Button
              onClick={handleConvert}
              isLoading={status === 'loading'}
              className="w-full max-w-md"
            >
              <FileType className="w-4 h-4 mr-2" />
              Convert Document
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
              Conversion completed successfully!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};