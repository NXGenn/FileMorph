import { ImageFormat, ConversionOptions, FileWithPreview } from '../types';

export async function convertImage(
  file: FileWithPreview,
  options: ConversionOptions
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      try {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert image'));
            }
          },
          options.format,
          options.quality || 0.92
        );
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Failed to process image'));
      }
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    // Use the existing preview URL instead of creating a new one
    img.src = file.preview;
  });
}

export function getFileExtension(format: ImageFormat): string {
  return format.split('/')[1];
}

export async function createDownloadLink(blob: Blob, filename: string): Promise<string> {
  return URL.createObjectURL(blob);
}