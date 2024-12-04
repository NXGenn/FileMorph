import * as XLSX from 'xlsx';
import { PDFDocument } from 'pdf-lib';

export async function convertExcelToText(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    let text = '';
    
    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      text += `Sheet: ${sheetName}\n${JSON.stringify(data, null, 2)}\n\n`;
    }
    
    return text;
  } catch (error) {
    throw new Error(`Failed to convert Excel to text: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function convertTextToExcel(text: string): Blob {
  try {
    const workbook = XLSX.utils.book_new();
    const rows = text.split('\n').map(line => [line]);
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    const excelBuffer = XLSX.write(workbook, { type: 'array' });
    return new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  } catch (error) {
    throw new Error(`Failed to convert text to Excel: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}