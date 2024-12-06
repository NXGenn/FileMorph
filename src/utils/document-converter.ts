import mammoth from 'mammoth';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export async function convertDocxToPdf(file: File): Promise<Blob> {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const result = await mammoth.convertToHtml({ arrayBuffer });
    
    if (!result.value) {
      throw new Error('Failed to extract content from DOCX file');
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Simple HTML to PDF conversion
    const text = result.value.replace(/<[^>]*>/g, '\n').trim();
    const fontSize = 12;
    const margin = 50;
    const lineHeight = fontSize * 1.2;
    
    const lines = [];
    let currentLine = '';
    const words = text.split(' ');
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const lineWidth = font.widthOfTextAtSize(testLine, fontSize);
      
      if (lineWidth > width - 2 * margin) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    
    lines.forEach((line, index) => {
      const y = height - margin - (index * lineHeight);
      if (y > margin) {
        page.drawText(line, {
          x: margin,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
      }
    });
    
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    throw new Error(`Failed to convert DOCX to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function convertPdfToDocx(file: File): Promise<Blob> {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    let text = '';
    for (const page of pages) {
      const content = await page.extractText();
      text += content + '\n\n';
    }
    
    // Create a simple HTML document
    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          ${text.split('\n').map(line => `<p>${line}</p>`).join('')}
        </body>
      </html>
    `;
    
    // Convert HTML to DOCX format
    const result = await mammoth.convertToBuffer({ value: html });
    return new Blob([result], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
  } catch (error) {
    throw new Error(`Failed to convert PDF to DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function convertExcelToPdf(file: File): Promise<Blob> {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      
      // Convert worksheet to JSON
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Draw table
      const margin = 50;
      const fontSize = 10;
      const lineHeight = fontSize * 1.5;
      const cellPadding = 5;
      const columnWidth = (width - 2 * margin) / (data[0]?.length || 1);
      
      data.forEach((row: any[], rowIndex) => {
        const y = height - margin - (rowIndex * lineHeight);
        if (y > margin) {
          row.forEach((cell, colIndex) => {
            const x = margin + (colIndex * columnWidth);
            page.drawText(String(cell), {
              x: x + cellPadding,
              y,
              size: fontSize,
              font,
              color: rgb(0, 0, 0),
            });
          });
        }
      });
    }
    
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    throw new Error(`Failed to convert Excel to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function convertPdfToExcel(file: File): Promise<Blob> {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Process each page
    for (let i = 0; i < pages.length; i++) {
      const text = await pages[i].extractText();
      
      // Split text into rows (simple approach)
      const rows = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => [line]); // Each line becomes a row with one cell
      
      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, `Page ${i + 1}`);
    }
    
    const excelBuffer = XLSX.write(workbook, { type: 'array' });
    return new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  } catch (error) {
    throw new Error(`Failed to convert PDF to Excel: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}