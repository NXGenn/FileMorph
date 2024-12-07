export type AudioFormat = 'mp3' | 'wav' | 'aac' | 'flac' | 'ogg';

export interface ConversionProgress {
    percentage: number;
    timeRemaining: number;
}

export interface AudioFile {
    file: File;
    name: string;
    size: number;
    type: string;
}