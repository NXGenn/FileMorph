import mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';

export async function convertHtmlToDocx(html: string): Promise<Blob> {
  try {
    const docxBuffer = await mammoth.convertToHtml({ text: html });
    return new Blob([docxBuffer.value], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
  } catch (error) {
    throw new Error(`Failed to convert HTML to DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function convertDocxToHtml(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return result.value;
  } catch (error) {
    throw new Error(`Failed to convert DOCX to HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}