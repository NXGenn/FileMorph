import React, { useState } from 'react';
import { ConversionPanel } from '../components/Conversion/ConversionPanel';
import { JobList } from '../components/JobList';
import { useStore } from '../store/useStore';
import { FileType, generateUniqueId } from '../utils/fileUtils';
import toast from 'react-hot-toast';

export const DocumentConversion: React.FC = () => {
  const { jobs, addJob, removeJob } = useStore();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState<FileType | ''>('');

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
    toast.success(`${files.length} file(s) selected`);
  };

  const handleConversion = () => {
    if (!targetFormat) {
      toast.error('Please select a target format');
      return;
    }

    selectedFiles.forEach((file) => {
      addJob({
        id: generateUniqueId(),
        sourceFile: file,
        targetFormat,
        progress: 0,
        status: 'pending',
      });
    });

    setSelectedFiles([]);
    setTargetFormat('');
    toast.success('Files added to conversion queue');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Document Conversion
      </h1>
      
      <ConversionPanel
        category="documents"
        selectedFiles={selectedFiles}
        onFileSelect={handleFileSelect}
        onFormatSelect={setTargetFormat}
        onConvert={handleConversion}
      />

      <div className="mt-6">
        <JobList jobs={jobs} onRemoveJob={removeJob} />
      </div>
    </div>
  );
};