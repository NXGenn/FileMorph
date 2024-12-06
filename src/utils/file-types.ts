// File type definitions and validation utilities
export const FILE_TYPES = {
  document: {
    extensions: ['.pdf', '.docx', '.xlsx', '.pptx', '.epub'],
    mimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/epub+zip'
    ],
    maxSize: 100 * 1024 * 1024, // 100MB
  },
  video: {
    extensions: ['.mp4', '.avi', '.mkv', '.mov', '.webm'],
    mimeTypes: [
      'video/mp4',
      'video/x-msvideo',
      'video/x-matroska',
      'video/quicktime',
      'video/webm'
    ],
    maxSize: 500 * 1024 * 1024, // 500MB
  },
  audio: {
    extensions: ['.mp3', '.wav', '.aac', '.flac', '.ogg', '.m4a'],
    mimeTypes: [
      'audio/mpeg',
      'audio/wav',
      'audio/aac',
      'audio/flac',
      'audio/ogg',
      'audio/mp4'
    ],
    maxSize: 200 * 1024 * 1024, // 200MB
  },
  image: {
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ],
    maxSize: 50 * 1024 * 1024, // 50MB
  }
};

export function isValidFileType(file: File, acceptedTypes: string): boolean {
  const types = acceptedTypes.split(',').map(type => type.trim());
  
  // Check file extension
  const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
  const isValidExtension = types.some(type => {
    if (type.startsWith('.')) {
      return type.toLowerCase() === extension;
    }
    return true;
  });

  // Check MIME type
  const isValidMimeType = types.some(type => {
    if (!type.startsWith('.')) {
      if (type.includes('*')) {
        const [mainType] = type.split('/*');
        return file.type.startsWith(mainType);
      }
      return file.type === type;
    }
    return true;
  });

  return isValidExtension && isValidMimeType;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}