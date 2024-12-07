export type DocumentFormat = 'pdf' | 'docx' | 'xlsx';
export type VideoFormat = 'mp4' | 'avi' | 'mkv' | 'mov' | 'webm';
export type AudioFormat = 'mp3' | 'wav' | 'aac' | 'flac' | 'ogg' | 'm4a';
export type TextFormat = 'json' | 'xml' | 'yaml' | 'txt';
export type Encoding = 'utf-8' | 'ascii' | 'iso-8859-1';

export const VIDEO_FORMATS = {
  mp4: {
    extension: '.mp4',
    mimeType: 'video/mp4',
    label: 'MP4'
  },
  avi: {
    extension: '.avi',
    mimeType: 'video/x-msvideo',
    label: 'AVI'
  },
  mkv: {
    extension: '.mkv',
    mimeType: 'video/x-matroska',
    label: 'MKV'
  },
  mov: {
    extension: '.mov',
    mimeType: 'video/quicktime',
    label: 'MOV'
  },
  webm: {
    extension: '.webm',
    mimeType: 'video/webm',
    label: 'WebM'
  }
} as const;

export const AUDIO_FORMATS = {
  mp3: {
    extension: '.mp3',
    mimeType: 'audio/mpeg',
    label: 'MP3',
    category: 'lossy'
  },
  wav: {
    extension: '.wav',
    mimeType: 'audio/wav',
    label: 'WAV',
    category: 'lossless'
  },
  aac: {
    extension: '.aac',
    mimeType: 'audio/aac',
    label: 'AAC',
    category: 'lossy'
  },
  flac: {
    extension: '.flac',
    mimeType: 'audio/flac',
    label: 'FLAC',
    category: 'lossless'
  },
  ogg: {
    extension: '.ogg',
    mimeType: 'audio/ogg',
    label: 'OGG',
    category: 'lossy'
  },
  m4a: {
    extension: '.m4a',
    mimeType: 'audio/mp4',
    label: 'M4A',
    category: 'lossy'
  }
} as const;

export const AUDIO_FORMAT_CATEGORIES = {
  lossy: ['mp3', 'aac', 'ogg', 'm4a'],
  lossless: ['wav', 'flac']
} as const;

export const SUPPORTED_VIDEO_CONVERSIONS = {
  'mp4-avi': 'MP4 to AVI',
  'mp4-webm': 'MP4 to WebM',
  'avi-mp4': 'AVI to MP4',
  'mov-mp4': 'MOV to MP4',
  'mkv-mp4': 'MKV to MP4'
} as const;

export const SUPPORTED_AUDIO_CONVERSIONS = {
  // Lossy to Lossy
  'mp3-aac': { label: 'MP3 to AAC', quality: 'maintained' },
  'mp3-m4a': { label: 'MP3 to M4A', quality: 'maintained' },
  'mp3-ogg': { label: 'MP3 to OGG', quality: 'maintained' },
  'aac-mp3': { label: 'AAC to MP3', quality: 'maintained' },
  'aac-m4a': { label: 'AAC to M4A', quality: 'maintained' },
  'aac-ogg': { label: 'AAC to OGG', quality: 'maintained' },
  'ogg-mp3': { label: 'OGG to MP3', quality: 'maintained' },
  'ogg-aac': { label: 'OGG to AAC', quality: 'maintained' },
  'ogg-m4a': { label: 'OGG to M4A', quality: 'maintained' },
  'm4a-mp3': { label: 'M4A to MP3', quality: 'maintained' },
  'm4a-aac': { label: 'M4A to AAC', quality: 'maintained' },
  'm4a-ogg': { label: 'M4A to OGG', quality: 'maintained' },
  
  // Lossless to Lossless
  'wav-flac': { label: 'WAV to FLAC', quality: 'lossless' },
  'flac-wav': { label: 'FLAC to WAV', quality: 'lossless' },
  
  // Lossless to Lossy
  'wav-mp3': { label: 'WAV to MP3', quality: 'reduced' },
  'wav-aac': { label: 'WAV to AAC', quality: 'reduced' },
  'wav-ogg': { label: 'WAV to OGG', quality: 'reduced' },
  'wav-m4a': { label: 'WAV to M4A', quality: 'reduced' },
  'flac-mp3': { label: 'FLAC to MP3', quality: 'reduced' },
  'flac-aac': { label: 'FLAC to AAC', quality: 'reduced' },
  'flac-ogg': { label: 'FLAC to OGG', quality: 'reduced' },
  'flac-m4a': { label: 'FLAC to M4A', quality: 'reduced' },
  
  // Lossy to Lossless (not recommended but supported)
  'mp3-wav': { label: 'MP3 to WAV', quality: 'no-improvement' },
  'mp3-flac': { label: 'MP3 to FLAC', quality: 'no-improvement' },
  'aac-wav': { label: 'AAC to WAV', quality: 'no-improvement' },
  'aac-flac': { label: 'AAC to FLAC', quality: 'no-improvement' },
  'ogg-wav': { label: 'OGG to WAV', quality: 'no-improvement' },
  'ogg-flac': { label: 'OGG to FLAC', quality: 'no-improvement' },
  'm4a-wav': { label: 'M4A to WAV', quality: 'no-improvement' },
  'm4a-flac': { label: 'M4A to FLAC', quality: 'no-improvement' }
} as const;

export interface ConversionOptions {
  sourceFormat: string;
  targetFormat: string;
  quality?: number;
  encoding?: Encoding;
}

export type ConversionType = 'document' | 'video' | 'audio' | 'text' | 'image';

export interface ConversionJob {
  id: string;
  file: File;
  type: ConversionType;
  sourceFormat: string;
  targetFormat: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  result?: Blob;
}