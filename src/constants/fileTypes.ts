export const SUPPORTED_FILE_TYPES = {
  documents: {
    pdf: ['docx', 'xlsx', 'pptx', 'jpg', 'png'],
    docx: ['pdf'],
    xlsx: ['pdf'],
    pptx: ['pdf'],
    epub: ['pdf'],
  },
  images: {
    jpg: ['png', 'webp', 'pdf', 'bmp'],
    png: ['jpg', 'webp', 'pdf', 'bmp'],
    webp: ['jpg', 'png', 'bmp'],
    bmp: ['jpg', 'png', 'webp'],
  },
  media: {
    mp4: ['mp3'],
    mp3: ['wav'],
    wav: ['mp3'],
  },
  code: {
    json: ['xml', 'yaml'],
    xml: ['json', 'yaml'],
    yaml: ['json', 'xml'],
  },
} as const;

export const FILE_TYPE_EXTENSIONS = {
  // Documents
  pdf: '.pdf',
  docx: '.docx',
  xlsx: '.xlsx',
  pptx: '.pptx',
  epub: '.epub',
  // Images
  jpg: '.jpg',
  png: '.png',
  webp: '.webp',
  bmp: '.bmp',
  // Media
  mp4: '.mp4',
  mp3: '.mp3',
  wav: '.wav',
  // Code
  json: '.json',
  xml: '.xml',
  yaml: '.yaml',
} as const;

export const MIME_TYPES = {
  // Documents
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  epub: 'application/epub+zip',
  // Images
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  bmp: 'image/bmp',
  // Media
  mp4: 'video/mp4',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  // Code
  json: 'application/json',
  xml: 'application/xml',
  yaml: 'application/x-yaml',
} as const;