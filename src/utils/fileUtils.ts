import { MIME_TYPES, FILE_TYPE_EXTENSIONS, SUPPORTED_FILE_TYPES } from '../constants/fileTypes';

export type FileCategory = keyof typeof SUPPORTED_FILE_TYPES;
export type FileType = keyof typeof MIME_TYPES;

export const getFileExtension = (filename: string): string => {
  const extension = filename.toLowerCase().split('.').pop();
  return extension || '';
};

export const getMimeType = (fileType: FileType): string => {
  return MIME_TYPES[fileType];
};

export const getFileTypeFromExtension = (filename: string): FileType | null => {
  const extension = getFileExtension(filename);
  const entry = Object.entries(FILE_TYPE_EXTENSIONS).find(
    ([_, ext]) => ext.slice(1) === extension
  );
  return entry ? (entry[0] as FileType) : null;
};

export const getFileTypeFromMime = (mimeType: string): FileType | null => {
  const entry = Object.entries(MIME_TYPES).find(([_, value]) => value === mimeType);
  return entry ? (entry[0] as FileType) : null;
};

export const validateFileType = (file: File, category: FileCategory): boolean => {
  const extension = getFileExtension(file.name);
  const fileType = Object.keys(SUPPORTED_FILE_TYPES[category]).find(
    type => FILE_TYPE_EXTENSIONS[type as FileType].slice(1) === extension
  );
  return !!fileType;
};

export const getTargetFormats = (sourceFile: File, category: FileCategory): FileType[] => {
  const sourceType = getFileTypeFromExtension(sourceFile.name);
  if (!sourceType) return [];
  
  const categoryTypes = SUPPORTED_FILE_TYPES[category];
  return (categoryTypes[sourceType] || []) as FileType[];
};

export const generateUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};