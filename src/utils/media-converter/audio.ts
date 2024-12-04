import { fetchFile } from '@ffmpeg/util';
import { getFFmpeg } from './ffmpeg-loader';

export async function convertAudio(file: File, targetFormat: string): Promise<Blob> {
  try {
    const ffmpeg = await getFFmpeg();
    const inputFileName = `input.${file.name.split('.').pop()}`;
    const outputFileName = `output.${targetFormat}`;

    await ffmpeg.writeFile(inputFileName, await fetchFile(file));
    await ffmpeg.exec([
      '-i', inputFileName,
      '-acodec', targetFormat === 'mp3' ? 'libmp3lame' : targetFormat,
      outputFileName
    ]);

    const data = await ffmpeg.readFile(outputFileName);
    const uint8Array = new Uint8Array(data as ArrayBuffer);

    return new Blob([uint8Array], { type: `audio/${targetFormat}` });
  } catch (error) {
    console.error('Audio conversion failed:', error);
    throw new Error(`Failed to convert audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}