import { PDFDocument } from 'pdf-lib';
import { jsPDF } from 'jspdf';
import { FileType } from '../../utils/fileUtils';
import { ImageConverter } from './imageConverter';

export class PDFConverter {
  static async convert(file: File, targetFormat: FileType): Promise<Blob> {
    switch (targetFormat) {
      case 'jpg':
      case 'png':
        return await this.toImage(file, targetFormat);
      default:
        throw new Error(`Conversion from PDF to ${targetFormat} is not supported yet`);
    }
  }

  static async toImage(file: File, format: 'jpg' | 'png'): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    if (pages.length === 0) {
      throw new Error('PDF has no pages');
    }

    const page = pages[0]; // Currently only converting first page
    const { width, height } = page.getSize();

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Draw PDF page to canvas
    const pdfjs = await import('pdfjs-dist');
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const pdfPage = await pdf.getPage(1);
    
    const viewport = pdfPage.getViewport({ scale: 1.0 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await pdfPage.render({
      canvasContext: ctx,
      viewport: viewport,
    }).promise;

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert PDF to image'));
          }
        },
        `image/${format}`,
        0.92
      );
    });
  }

  static async fromImage(file: File): Promise<Blob> {
    const dataUrl = await ImageConverter.toDataUrl(file);
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
    });

    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = dataUrl;
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    const imgRatio = img.width / img.height;
    const pageRatio = pageWidth / pageHeight;
    
    let finalWidth = pageWidth;
    let finalHeight = pageWidth / imgRatio;
    
    if (finalHeight > pageHeight) {
      finalHeight = pageHeight;
      finalWidth = pageHeight * imgRatio;
    }

    const x = (pageWidth - finalWidth) / 2;
    const y = (pageHeight - finalHeight) / 2;

    doc.addImage(dataUrl, 'PNG', x, y, finalWidth, finalHeight);
    return new Blob([doc.output('blob')], { type: 'application/pdf' });
  }
}