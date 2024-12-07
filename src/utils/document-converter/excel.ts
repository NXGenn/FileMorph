import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as XLSX from 'xlsx';
import { readFileAsArrayBuffer } from './helpers';

export async function convertExcelToPdf(file: File): Promise<Blob> {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      let currentPage = pdfDoc.addPage();
      const { width, height } = currentPage.getSize();
      
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
      
      if (data.length === 0) continue;
      
      const margin = 50;
      const fontSize = 10;
      const lineHeight = fontSize * 1.5;
      const cellPadding = 5;
      const columnWidth = (width - 2 * margin) / data[0].length;
      
      let y = height - margin;
      
      for (const row of data) {
        if (y < margin) {
          currentPage = pdfDoc.addPage();
          y = height - margin;
        }
        
        row.forEach((cell, colIndex) => {
          const x = margin + (colIndex * columnWidth);
          currentPage.drawText(String(cell ?? ''), {
            x: x + cellPadding,
            y,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          });
        });
        
        y -= lineHeight;
      }
    }
    
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Excel to PDF conversion failed:', error);
    throw new Error('Failed to convert Excel file to PDF. Please ensure the file is not corrupted.');
  }
}

export async function convertPdfToExcel(file: File): Promise<Blob> {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    const workbook = XLSX.utils.book_new();
    
    for (let i = 0; i < pages.length; i++) {
      const text = await pages[i].extractText();
      
      // Split text into rows and columns (basic table detection)
      const rows = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => line.split(/\s{2,}/)); // Split by 2 or more spaces to detect columns
      
      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, `Page ${i + 1}`);
    }
    
    const excelBuffer = XLSX.write(workbook, { type: 'array' });
    return new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  } catch (error) {
    console.error('PDF to Excel conversion failed:', error);
    throw new Error('Failed to convert PDF to Excel. Please ensure the PDF contains properly formatted tabular data.');
  }
}