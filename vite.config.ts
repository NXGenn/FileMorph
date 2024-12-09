import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    middleware: [
      (req, res, next) => {
        if (req.url.includes('.') || req.url.startsWith('/api')) {
          next();
        } else {
          req.url = '/index.html';
          next();
        }
      }
    ]
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        pdfWorker: resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs')
      },
      output: {
        manualChunks: {
          pdfWorker: ['pdfjs-dist/build/pdf.worker.min.mjs']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['pdfjs-dist']
  }
});
