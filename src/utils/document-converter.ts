import mammoth from 'mammoth';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';
import { configurePdfWorker } from './pdf-config';
import { Document, Paragraph, TextRun, Packer, ISectionOptions } from 'docx';

// Configure PDF.js worker
configurePdfWorker();

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
      throw new Error('Failed to extract content from Word document');
    }

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Convert HTML to plain text and handle basic formatting
    const text = result.value.replace(/<[^>]*>/g, '\n').trim();
    const fontSize = 12;
    const margin = 50;
    const lineHeight = fontSize * 1.2;
    
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let currentLine = '';
    
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
    
    // Create new pages as needed
    let currentPage = page;
    let y = height - margin;
    
    for (const line of lines) {
      if (y < margin) {
        currentPage = pdfDoc.addPage();
        y = height - margin;
      }
      
      currentPage.drawText(line, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      
      y -= lineHeight;
    }
    
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('DOCX to PDF conversion failed:', error);
    throw new Error('Failed to convert Word document to PDF. Please ensure the file is not corrupted.');
  }
}

export async function convertPdfToDocx(file: File): Promise<Blob> {
  try {
    console.log('Starting PDF to DOCX conversion...');
    const arrayBuffer = await readFileAsArrayBuffer(file);
    console.log('File loaded as ArrayBuffer');
    
    // Ensure worker is configured
    configurePdfWorker();
    
    // Load the PDF using pdf.js
    console.log('Loading PDF document...');
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      verbosity: 0  // Reduce console noise
    });
    const pdf = await loadingTask.promise;
    console.log(`PDF loaded successfully. Number of pages: ${pdf.numPages}`);
    
    // Prepare sections for the Word document
    const sections: ISectionOptions[] = [];
    
    // Extract text from each page with better formatting
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`Processing page ${i}...`);
      let page = await pdf.getPage(i);
      const content = await page.getTextContent();
      
      if (!content.items || content.items.length === 0) {
        console.warn(`No text content found on page ${i}`);
        continue;
      }
      
      // Process text items with position information
      const paragraphs: Paragraph[] = [];
      let currentParagraph: string[] = [];
      let lastY = 0;
      
      content.items.forEach((item: TextItem, index: number) => {
        const y = Math.round(item.transform[5]);
        const text = item.str.trim();
        
        if (text === '') return;
        
        if (index === 0) {
          lastY = y;
          currentParagraph.push(text);
        } else {
          const yDiff = Math.abs(y - lastY);
          if (yDiff > 12) {
            // New paragraph
            if (currentParagraph.length > 0) {
              paragraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: currentParagraph.join(' '),
                      size: 24 // 12pt font
                    })
                  ]
                })
              );
              currentParagraph = [];
            }
            currentParagraph.push(text);
          } else {
            currentParagraph.push(text);
          }
          lastY = y;
        }
      });
      
      // Add the last paragraph if any
      if (currentParagraph.length > 0) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: currentParagraph.join(' '),
                size: 24
              })
            ]
          })
        );
      }
      
      // Add page content as a section
      sections.push({
        properties: {},
        children: paragraphs
      });
      
      console.log(`Page ${i} processed successfully`);
    }
    
    // Create the Word document with all sections
    const doc = new Document({
      sections: sections
    });
    
    console.log('Creating DOCX document...');
    // Use browser-compatible blob creation
    const blob = await Packer.toBlob(doc);
    
    console.log('Conversion completed successfully');
    return blob;
  } catch (error) {
    console.error('PDF to DOCX conversion failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error(
      error instanceof Error && error.message
        ? `Failed to convert PDF to Word: ${error.message}`
        : 'Failed to convert PDF to Word. Please ensure the PDF contains extractable text and try again.'
    );
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
      let page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      
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
          page = pdfDoc.addPage();
          y = height - margin;
        }
        
        row.forEach((cell, colIndex) => {
          const x = margin + (colIndex * columnWidth);
          page.drawText(String(cell ?? ''), {
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