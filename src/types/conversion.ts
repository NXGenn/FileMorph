export type DocumentFormat = 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'epub';
export type VideoFormat = 'mp4' | 'avi' | 'mkv' | 'mov';
export type AudioFormat = 'mp3' | 'wav' | 'aac' | 'flac';
export type TextFormat = 'json' | 'xml' | 'yaml' | 'txt';
export type Encoding = 'utf-8' | 'ascii' | 'iso-8859-1';

export interface ConversionOptions {
  sourceFormat: string;
  targetFormat: string;
  quality?: number;
  encoding?: Encoding;
}

export type ConversionType = 'document' | 'video' | 'audio' | 'text' | 'image';

export interface ConversionJob {
  id: string;
  file: File;
  type: ConversionType;
  sourceFormat: string;
  targetFormat: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  result?: Blob;
}