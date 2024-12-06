import { FileType, getFileExtension } from '../utils/fileUtils';
import { ImageConverter } from './converters/imageConverter';
import { DocumentConverter } from './converters/documentConverter';
import { PDFConverter } from './converters/pdfConverter';

export class ConversionService {
  static async convertFile(file: File, targetFormat: FileType): Promise<Blob> {
    const sourceExtension = getFileExtension(file.name);

    // Handle image conversions
    if (['jpg', 'jpeg', 'png', 'webp', 'bmp'].includes(sourceExtension)) {
      if (['jpg', 'png', 'webp', 'bmp'].includes(targetFormat)) {
        return await ImageConverter.convert(file, targetFormat);
      } else if (targetFormat === 'pdf') {
        return await PDFConverter.fromImage(file);
      }
    }

    // Handle PDF conversions
    if (sourceExtension === 'pdf') {
      return await PDFConverter.convert(file, targetFormat);
    }

    // Handle document conversions
    if (['docx', 'xlsx', 'pptx', 'epub'].includes(sourceExtension)) {
      return await DocumentConverter.convert(file, targetFormat);
    }

    throw new Error(`Conversion from ${sourceExtension} to ${targetFormat} is not supported yet`);
  }
}