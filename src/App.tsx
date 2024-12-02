import React, { useState, useCallback } from 'react';
import { FileWithPreview, ImageFormat, ConversionStatus } from './types';
import { DropZone } from './components/DropZone';
import { ImagePreview } from './components/ImagePreview';
import { FormatSelector } from './components/FormatSelector';
import { Button } from './components/ui/Button';
import { convertImage, getFileExtension, createDownloadLink } from './utils/image-converter';
import { createPDFFromImages } from './utils/pdf-generator';
import { Download, FileType } from 'lucide-react';

function App() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('image/jpeg');
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleFilesDrop = useCallback((newFiles: FileWithPreview[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setError(null);
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, []);

  const handleConvertImages = async () => {
    if (files.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const convertedFiles = await Promise.all(
        files.map((file) =>
          convertImage(file, {
            format: targetFormat,
            quality: 0.92,
          })
        )
      );

      // Create download links
      const downloadLinks = await Promise.all(
        convertedFiles.map((blob, index) =>
          createDownloadLink(
            blob,
            `converted-${index + 1}.${getFileExtension(targetFormat)}`
          )
        )
      );

      // Trigger downloads
      downloadLinks.forEach((link, index) => {
        const a = document.createElement('a');
        a.href = link;
        a.download = `converted-${index + 1}.${getFileExtension(targetFormat)}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(link);
      });

      setStatus('success');
    } catch (err) {
      console.error('Image conversion failed:', err);
      setError('Failed to convert images. Please try again.');
      setStatus('error');
    }
  };

  const handleCreatePDF = async () => {
    if (files.length === 0) {
      setError('Please select at least one image');
      return;
    }

    if (files.length > 20) {
      setError('Maximum 20 images allowed for PDF creation');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      console.log('Starting PDF creation...');
      const pdfBytes = await createPDFFromImages(files);
      console.log('PDF created, creating blob...');
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      console.log('Downloading PDF...');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted-images.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus('success');
    } catch (err) {
      console.error('PDF creation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to create PDF. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Image Converter</h1>
          <p className="mt-2 text-gray-600">
            Convert your images to different formats or combine them into a PDF
          </p>
        </div>

        <DropZone onFilesDrop={handleFilesDrop} />

        {files.length > 0 && (
          <>
            <ImagePreview files={files} onRemove={handleRemoveFile} />

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Format
                  </label>
                  <FormatSelector
                    value={targetFormat}
                    onChange={setTargetFormat}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Actions
                  </label>
                  <div className="flex gap-4">
                    <Button
                      onClick={handleConvertImages}
                      isLoading={status === 'loading'}
                      className="flex-1"
                    >
                      <FileType className="w-4 h-4" />
                      Convert Images
                    </Button>
                    <Button
                      onClick={handleCreatePDF}
                      isLoading={status === 'loading'}
                      variant="secondary"
                      className="flex-1"
                    >
                      <Download className="w-4 h-4" />
                      Create PDF
                    </Button>
                  </div>
                </div>
              </div>

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
          </>
        )}
      </div>
    </div>
  );
}

export default App;