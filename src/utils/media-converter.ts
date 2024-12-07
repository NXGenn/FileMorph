import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { VideoFormat } from '../types/conversion';

let ffmpeg: FFmpeg | null = null;

async function loadFFmpeg() {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();
  
  try {
    // Load FFmpeg with necessary codecs
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    console.log('FFmpeg loaded successfully');
    return ffmpeg;
  } catch (error) {
    console.error('Failed to load FFmpeg:', error);
    throw new Error('Failed to initialize video converter');
  }
}

export async function convertVideo(file: File, targetFormat: VideoFormat): Promise<Blob> {
  try {
    console.log('Starting video conversion...', { 
      sourceFormat: file.name.split('.').pop(),
      targetFormat,
      fileSize: file.size,
      fileType: file.type 
    });
    
    const ffmpeg = await loadFFmpeg();

    // Enable FFmpeg logging
    ffmpeg.on('log', ({ message }) => {
      console.log('FFmpeg log:', message);
    });

    const inputFileName = 'input.' + file.name.split('.').pop();
    const outputFileName = 'output.' + targetFormat;

    console.log('Writing input file...', { inputFileName });
    await ffmpeg.writeFile(inputFileName, await fetchFile(file));
    console.log('Input file written successfully');

    const command = ['-i', inputFileName];

    // Add format-specific encoding settings
    switch (targetFormat) {
      case 'mp4':
        command.push(
          '-c:v', 'libx264', // Use H.264 codec
          '-preset', 'medium', // Balance between speed and quality
          '-crf', '23', // Constant Rate Factor for quality
          '-c:a', 'aac',
          '-b:a', '128k', // Audio bitrate
          '-movflags', '+faststart', // Enable fast start for web playback
          '-strict', 'experimental'
        );
        break;
      case 'webm':
        command.push(
          '-c:v', 'libvpx-vp9', // Use VP9 codec
          '-crf', '30', // Quality level
          '-b:v', '0', // Use constant quality
          '-c:a', 'libopus', // Use Opus audio codec
          '-b:a', '128k' // Audio bitrate
        );
        break;
      case 'avi':
        command.push(
          '-c:v', 'mpeg4', // Use MPEG-4 codec
          '-q:v', '6', // Quality level (2-31, lower is better)
          '-c:a', 'libmp3lame',
          '-b:a', '192k' // Audio bitrate
        );
        break;
      default:
        command.push(
          '-c:v', 'libx264', // Default to H.264
          '-preset', 'medium',
          '-crf', '23',
          '-c:a', 'aac',
          '-b:a', '128k'
        );
    }

    // Add output filename and overwrite flag
    command.push('-y', outputFileName);

    console.log('Starting FFmpeg conversion with command:', command);
    await ffmpeg.exec(command);
    console.log('FFmpeg conversion completed');

    console.log('Reading output file...');
    const data = await ffmpeg.readFile(outputFileName);
    console.log('Output file read successfully');

    // Clean up
    console.log('Cleaning up...');
    try {
      await ffmpeg.deleteFile(inputFileName);
      await ffmpeg.deleteFile(outputFileName);
    } catch (error) {
      console.warn('Cleanup failed:', error);
    }

    const uint8Array = new Uint8Array(data as ArrayBuffer);
    const mimeTypes: Record<string, string> = {
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'avi': 'video/x-msvideo',
      'mkv': 'video/x-matroska',
      'mov': 'video/quicktime'
    };

    console.log('Creating Blob with MIME type:', mimeTypes[targetFormat]);
    return new Blob([uint8Array], { type: mimeTypes[targetFormat] });
  } catch (error) {
    console.error('Video conversion failed:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to convert video: ${error.message}`
        : 'Failed to convert video. Please try again.'
    );
  }
}

export async function extractAudioFromVideo(file: File): Promise<Blob> {
  try {
    console.log('Starting audio extraction...');
    const ffmpeg = await loadFFmpeg();

    const inputFileName = 'input.' + file.name.split('.').pop();
    const outputFileName = 'output.mp3';

    console.log('Writing input file...');
    await ffmpeg.writeFile(inputFileName, await fetchFile(file));
    console.log('Input file written successfully');

    const command = [
      '-i', inputFileName,
      '-vn',                // Remove video
      '-c:a', 'libmp3lame', // MP3 codec
      '-b:a', '192k',       // Bitrate
      '-y',                 // Overwrite output
      outputFileName
    ];

    console.log('Starting audio extraction with command:', command);
    await ffmpeg.exec(command);
    console.log('Audio extraction completed');

    console.log('Reading output file...');
    const data = await ffmpeg.readFile(outputFileName);
    console.log('Output file read successfully');

    // Clean up
    console.log('Cleaning up...');
    try {
      await ffmpeg.deleteFile(inputFileName);
      await ffmpeg.deleteFile(outputFileName);
    } catch (error) {
      console.warn('Cleanup failed:', error);
    }

    const uint8Array = new Uint8Array(data as ArrayBuffer);
    return new Blob([uint8Array], { type: 'audio/mp3' });
  } catch (error) {
    console.error('Audio extraction failed:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to extract audio: ${error.message}`
        : 'Failed to extract audio. Please try again.'
    );
  }
}

export async function convertAudio(file: File, targetFormat: string): Promise<Blob> {
  try {
    console.log('Starting audio conversion...');
    const ffmpeg = await loadFFmpeg();
    const inputFileName = 'input.' + file.name.split('.').pop();
    const outputFileName = 'output.' + targetFormat;

    console.log('Writing input file...');
    await ffmpeg.writeFile(inputFileName, await fetchFile(file));

    console.log('Starting FFmpeg conversion...');
    const command = ['-i', inputFileName];

    // Set codec and options based on target format
    switch (targetFormat) {
      case 'mp3':
        command.push('-c:a', 'libmp3lame', '-b:a', '192k');
        break;
      case 'wav':
        command.push('-c:a', 'pcm_s16le');
        break;
      case 'aac':
        command.push('-c:a', 'aac', '-b:a', '192k');
        break;
      case 'flac':
        command.push('-c:a', 'flac');
        break;
      case 'ogg':
        command.push('-c:a', 'libvorbis');
        break;
      case 'm4a':
        command.push('-c:a', 'aac', '-b:a', '192k');
        break;
      default:
        throw new Error('Unsupported target format');
    }

    command.push('-y', outputFileName); // Overwrite output

    console.log('FFmpeg command:', command);
    await ffmpeg.exec(command);
    console.log('FFmpeg conversion completed');

    console.log('Reading output file...');
    const data = await ffmpeg.readFile(outputFileName);
    console.log('Output file read successfully');

    // Clean up
    console.log('Cleaning up...');
    try {
      await ffmpeg.deleteFile(inputFileName);
      await ffmpeg.deleteFile(outputFileName);
    } catch (error) {
      console.warn('Cleanup failed:', error);
    }

    const uint8Array = new Uint8Array(data as ArrayBuffer);
    return new Blob([uint8Array], { type: `audio/${targetFormat}` });
  } catch (error) {
    console.error('Audio conversion failed:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to convert audio: ${error.message}`
        : 'Failed to convert audio. Please try again.'
    );
  }
}