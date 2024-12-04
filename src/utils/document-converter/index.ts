import { PDFDocument } from 'pdf-lib';
import { extractTextFromPdf } from './pdf';
import { convertHtmlToDocx, convertDocxToHtml } from './word';
import { convertExcelToText, convertTextToExcel } from './excel';

export async function convertDocxToPdf(file: File): Promise<Blob> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const html = await convertDocxToHtml(arrayBuffer);
    
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    // Convert HTML to plain text for now (in production, use a proper HTML renderer)
    const text = html.replace(/<[^>]*>/g, '');
    
    page.drawText(text, {
      x: 50,
      y: height - 50,
      size: 12,
      maxWidth: width - 100,
    });
    
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    throw new Error(`Failed to convert DOCX to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function convertPdfToDocx(file: File): Promise<Blob> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const text = await extractTextFromPdf(arrayBuffer);
    
    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          ${text.split('\n').map(line => `<p>${line}</p>`).join('')}
        </body>
      </html>
    `;
    
    return await convertHtmlToDocx(html);
  } catch (error) {
    throw new Error(`Failed to convert PDF to DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function convertExcelToPdf(file: File): Promise<Blob> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const text = await convertExcelToText(arrayBuffer);
    
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    page.drawText(text, {
      x: 50,
      y: height - 50,
      size: 10,
      maxWidth: width - 100,
    });
    
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    throw new Error(`Failed to convert Excel to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function convertPdfToExcel(file: File): Promise<Blob> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const text = await extractTextFromPdf(arrayBuffer);
    return convertTextToExcel(text);
  } catch (error) {
    throw new Error(`Failed to convert PDF to Excel: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}