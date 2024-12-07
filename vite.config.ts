import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// Custom plugin to copy PDF.js worker file
const copyPdfWorker = () => ({
  name: 'copy-pdf-worker',
  buildStart() {
    const workerPath = resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
    const destPath = resolve(__dirname, 'public/pdfjs-dist/build/pdf.worker.min.mjs');
    
    if (!fs.existsSync(resolve(__dirname, 'public/pdfjs-dist/build'))) {
      fs.mkdirSync(resolve(__dirname, 'public/pdfjs-dist/build'), { recursive: true });
    }
    
    fs.copyFileSync(workerPath, destPath);
  }
});

export default defineConfig({
  plugins: [react(), copyPdfWorker()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['pdfjs-dist']
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdfWorker: ['pdfjs-dist/build/pdf.worker.min.js']
        }
      }
    }
  }
});
