import { PDFDocument } from 'pdf-lib';
import { FileType } from '../../utils/fileUtils';
import { PDFConverter } from './pdfConverter';

export class DocumentConverter {
  static async convert(file: File, targetFormat: FileType): Promise<Blob> {
    const sourceType = file.name.split('.').pop()?.toLowerCase();

    if (sourceType === 'pdf') {
      return await PDFConverter.convert(file, targetFormat);
    } else if (['jpg', 'png', 'webp'].includes(sourceType || '') && targetFormat === 'pdf') {
      return await PDFConverter.fromImage(file);
    }

    throw new Error(`Conversion from ${sourceType} to ${targetFormat} is not supported yet`);
  }
}