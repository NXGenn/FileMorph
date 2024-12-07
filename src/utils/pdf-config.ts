import * as pdfjsLib from 'pdfjs-dist';

export function configurePdfWorker() {
  if (typeof window !== 'undefined') {
    const workerUrl = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      window.location.origin + '/'
    ).toString();
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
  }
}
