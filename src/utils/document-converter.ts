import mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export async function convertDocxToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  
  // Add the HTML content to PDF
  page.drawText(result.value);
  
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function convertPdfToDocx(file: File): Promise<Blob> {
  // Note: This is a simplified version. In production, you'd want to use a more robust solution
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  
  let text = '';
  for (const page of pages) {
    // Extract text from PDF
    const { width, height } = page.getSize();
    text += await page.extractText();
  }
  
  // Create a simple DOCX with the extracted text
  const docx = await mammoth.convertToHtml({ text });
  return new Blob([docx.value], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}

export async function convertExcelToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  const pdfDoc = await PDFDocument.create();
  
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const page = pdfDoc.addPage();
    
    // Convert worksheet data to text and add to PDF
    const data = XLSX.utils.sheet_to_json(worksheet);
    const text = JSON.stringify(data, null, 2);
    page.drawText(text);
  }
  
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function convertPdfToExcel(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Extract text from each page and add to worksheet
  for (let i = 0; i < pages.length; i++) {
    const text = await pages[i].extractText();
    const worksheet = XLSX.utils.aoa_to_sheet([[text]]);
    XLSX.utils.book_append_sheet(workbook, worksheet, `Page ${i + 1}`);
  }
  
  const excelBuffer = XLSX.write(workbook, { type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}