import mammoth from 'mammoth';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { readFileAsArrayBuffer, sanitizeText } from './helpers';

export async function convertDocxToPdf(file: File): Promise<Blob> {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const result = await mammoth.convertToHtml({ arrayBuffer });
    
    if (!result.value) {
      throw new Error('Failed to extract content from Word document');
    }

    const pdfDoc = await PDFDocument.create();
    let currentPage = pdfDoc.addPage();
    const { width, height } = currentPage.getSize();
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
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    // Extract and process text from all pages
    const extractedText = await Promise.all(
      pages.map(async (page) => {
        const content = await page.extractText();
        return sanitizeText(content);
      })
    );

    // Create a structured document object that mammoth can process
    const documentObj = {
      content: extractedText.map(pageText => ({
        type: 'paragraph',
        content: pageText.split('\n').map(line => ({
          type: 'run',
          text: line.trim()
        })).filter(run => run.text.length > 0)
      })).filter(para => para.content.length > 0),
      style: {
        paragraphProperties: {
          spacing: { line: 276 }, // 1.15 line spacing
          indentation: { firstLine: 720 } // 0.5 inch first line indent
        },
        runProperties: {
          size: 24, // 12pt font
          font: 'Calibri'
        }
      }
    };

    // Convert the document object to DOCX format
    const options = {
      styleMap: [
        "p => p:fresh",
        "r => r:fresh"
      ]
    };

    const buffer = await mammoth.convertToBuffer({ value: documentObj, options });
    
    return new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
  } catch (error) {
    console.error('PDF to DOCX conversion failed:', error);
    throw new Error('Failed to convert PDF to Word. Please ensure the PDF contains extractable text.');
  }
}