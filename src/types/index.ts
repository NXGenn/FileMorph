export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

export interface FileWithPreview extends File {
  preview: string;
}

export interface ConversionOptions {
  format: ImageFormat;
  quality?: number;
}

export type ConversionStatus = 'idle' | 'loading' | 'success' | 'error';