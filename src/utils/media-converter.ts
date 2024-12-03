import FFmpeg from 'ffmpeg.js';

export async function convertVideo(file: File, targetFormat: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await FFmpeg.createWorker({
    corePath: 'ffmpeg-core.js',
  });

  await result.load();
  await result.write('input.' + file.name.split('.').pop(), new Uint8Array(arrayBuffer));
  
  await result.run('-i', 'input.' + file.name.split('.').pop(), 'output.' + targetFormat);
  
  const { data } = await result.read('output.' + targetFormat);
  await result.terminate();
  
  return new Blob([data.buffer], { type: 'video/' + targetFormat });
}

export async function extractAudioFromVideo(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await FFmpeg.createWorker({
    corePath: 'ffmpeg-core.js',
  });

  await result.load();
  await result.write('input.' + file.name.split('.').pop(), new Uint8Array(arrayBuffer));
  
  await result.run('-i', 'input.' + file.name.split('.').pop(), '-vn', '-acodec', 'libmp3lame', 'output.mp3');
  
  const { data } = await result.read('output.mp3');
  await result.terminate();
  
  return new Blob([data.buffer], { type: 'audio/mp3' });
}

export async function convertAudio(file: File, targetFormat: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await FFmpeg.createWorker({
    corePath: 'ffmpeg-core.js',
  });

  await result.load();
  await result.write('input.' + file.name.split('.').pop(), new Uint8Array(arrayBuffer));
  
  await result.run('-i', 'input.' + file.name.split('.').pop(), 'output.' + targetFormat);
  
  const { data } = await result.read('output.' + targetFormat);
  await result.terminate();
  
  return new Blob([data.buffer], { type: 'audio/' + targetFormat });
}