import mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function convertDocxToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  
  // Add the HTML content to PDF
  const { width, height } = page.getSize();
  page.drawText(result.value, {
    x: 50,
    y: height - 50,
    size: 12,
    maxWidth: width - 100,
  });
  
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function convertPdfToDocx(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(' ');
    text += pageText + '\n\n';
  }
  
  // Create a simple HTML document with the extracted text
  const html = `
    <!DOCTYPE html>
    <html>
      <body>
        ${text.split('\n').map(line => `<p>${line}</p>`).join('')}
      </body>
    </html>
  `;
  
  // Convert HTML to DOCX using mammoth (in reverse)
  const docxBuffer = await mammoth.convertToHtml({ text: html });
  return new Blob([docxBuffer.value], { 
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  });
}

export async function convertExcelToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  const pdfDoc = await PDFDocument.create();
  
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    // Convert worksheet data to formatted text
    const data = XLSX.utils.sheet_to_json(worksheet);
    const formattedText = JSON.stringify(data, null, 2);
    
    // Draw text with proper formatting
    page.drawText(formattedText, {
      x: 50,
      y: height - 50,
      size: 10,
      maxWidth: width - 100,
    });
  }
  
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function convertPdfToExcel(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Extract text from each page and add to worksheet
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(' ');
    
    // Convert text to worksheet data
    const rows = pageText.split('\n').map(line => [line]);
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, `Page ${i}`);
  }
  
  const excelBuffer = XLSX.write(workbook, { type: 'array' });
  return new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
}