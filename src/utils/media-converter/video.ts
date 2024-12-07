import { fetchFile } from '@ffmpeg/util';
import { getFFmpeg } from './ffmpeg-loader';

export async function convertVideo(file: File, targetFormat: string): Promise<Blob> {
  try {
    const ffmpeg = await getFFmpeg();
    const inputFileName = `input.${file.name.split('.').pop()}`;
    const outputFileName = `output.${targetFormat}`;

    await ffmpeg.writeFile(inputFileName, await fetchFile(file));
    await ffmpeg.exec(['-i', inputFileName, outputFileName]);

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

    await ffmpeg.writeFile(inputFileName, await fetchFile(file));
    await ffmpeg.exec([
      '-i', inputFileName,
      '-vn',
      '-acodec', 'libmp3lame',
      '-q:a', '2',
      outputFileName
    ]);

    const data = await ffmpeg.readFile(outputFileName);
    const uint8Array = new Uint8Array(data as ArrayBuffer);

    return new Blob([uint8Array], { type: 'audio/mp3' });
  } catch (error) {
    console.error('Audio extraction failed:', error);
    throw new Error(`Failed to extract audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}