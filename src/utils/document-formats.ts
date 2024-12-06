import { DocumentFormat } from '../types/conversion';

export const DOCUMENT_FORMATS = {
  pdf: {
    extension: '.pdf',
    mimeType: 'application/pdf',
    label: 'PDF'
  },
  docx: {
    extension: '.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    label: 'Word'
  },
  xlsx: {
    extension: '.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    label: 'Excel'
  }
} as const;

export const SUPPORTED_CONVERSIONS = {
  'docx-pdf': 'Word to PDF',
  'pdf-docx': 'PDF to Word',
  'xlsx-pdf': 'Excel to PDF',
  'pdf-xlsx': 'PDF to Excel'
} as const;

export function getFormatInfo(format: DocumentFormat) {
  return DOCUMENT_FORMATS[format];
}

export function isConversionSupported(source: DocumentFormat, target: DocumentFormat): boolean {
  return `${source}-${target}` in SUPPORTED_CONVERSIONS;
}