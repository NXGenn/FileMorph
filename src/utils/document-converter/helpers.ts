export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export function sanitizeText(text: string): string {
  return text
    .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable characters
    .replace(/\s+/g, ' ')           // Normalize whitespace
    .replace(/\n\s*\n/g, '\n')      // Remove multiple consecutive line breaks
    .split('\n')                    // Split into lines
    .map(line => line.trim())       // Trim each line
    .filter(line => line.length > 0) // Remove empty lines
    .join('\n');                    // Join back with single line breaks
}

export function detectParagraphs(text: string): string[] {
  return text
    .split(/(?:\r?\n){2,}/)
    .map(para => para.trim())
    .filter(para => para.length > 0);
}