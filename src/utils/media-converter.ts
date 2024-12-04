import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

async function getFFmpeg() {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  }
  return ffmpeg;
}

export async function convertVideo(file: File, targetFormat: string): Promise<Blob> {
  try {
    const ffmpeg = await getFFmpeg();
    const inputFileName = `input.${file.name.split('.').pop()}`;
    const outputFileName = `output.${targetFormat}`;

    // Write input file to FFmpeg's virtual file system
    await ffmpeg.writeFile(inputFileName, await fetchFile(file));

    // Run FFmpeg command
    await ffmpeg.exec(['-i', inputFileName, outputFileName]);

    // Read the output file
    const data = await ffmpeg.readFile(outputFileName);
    const uint8Array = new Uint8Array(data as ArrayBuffer);

    return new Blob([uint8Array], { type: `video/${targetFormat}` });
  } catch (error) {
    console.error('Video conversion failed:', error);
    throw new Error(`Failed to convert video: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function extractAudioFromVideo(file: File): Promise<Blob> {
  try {
    const ffmpeg = await getFFmpeg();
    const inputFileName = `input.${file.name.split('.').pop()}`;
    const outputFileName = 'output.mp3';

    // Write input file to FFmpeg's virtual file system
    await ffmpeg.writeFile(inputFileName, await fetchFile(file));

    // Extract audio using FFmpeg
    await ffmpeg.exec([
      '-i', inputFileName,
      '-vn', // Disable video
      '-acodec', 'libmp3lame',
      '-q:a', '2', // High quality audio
      outputFileName
    ]);

    // Read the output file
    const data = await ffmpeg.readFile(outputFileName);
    const uint8Array = new Uint8Array(data as ArrayBuffer);

    return new Blob([uint8Array], { type: 'audio/mp3' });
  } catch (error) {
    console.error('Audio extraction failed:', error);
    throw new Error(`Failed to extract audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function convertAudio(file: File, targetFormat: string): Promise<Blob> {
  try {
    const ffmpeg = await getFFmpeg();
    const inputFileName = `input.${file.name.split('.').pop()}`;
    const outputFileName = `output.${targetFormat}`;

    // Write input file to FFmpeg's virtual file system
    await ffmpeg.writeFile(inputFileName, await fetchFile(file));

    // Convert audio using FFmpeg
    await ffmpeg.exec([
      '-i', inputFileName,
      '-acodec', targetFormat === 'mp3' ? 'libmp3lame' : targetFormat,
      outputFileName
    ]);

    // Read the output file
    const data = await ffmpeg.readFile(outputFileName);
    const uint8Array = new Uint8Array(data as ArrayBuffer);

    return new Blob([uint8Array], { type: `audio/${targetFormat}` });
  } catch (error) {
    console.error('Audio conversion failed:', error);
    throw new Error(`Failed to convert audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}