import { FileType } from '../utils/fileUtils';

export interface ConversionJob {
  id: string;
  sourceFile: File;
  targetFormat: FileType;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
}

export interface FilePreview {
  id: string;
  url: string;
  type: string;
  name: string;
}

export { FileType };
