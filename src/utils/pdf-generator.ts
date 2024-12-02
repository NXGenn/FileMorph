import { PDFDocument, PageSizes } from 'pdf-lib';
import { ImageFormat, FileWithPreview } from '../types';

interface ProcessedImage {
  width: number;
  height: number;
  data: Uint8Array;
  type: ImageFormat;
}

async function processImage(file: FileWithPreview): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      try {
        // Set reasonable max dimensions to prevent memory issues
        const MAX_DIMENSION = 2000;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to PNG for consistency
        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              reject(new Error('Failed to convert image to PNG'));
              return;
            }

            try {
              const arrayBuffer = await blob.arrayBuffer();
              resolve({
                width,
                height,
                data: new Uint8Array(arrayBuffer),
                type: 'image/png',
              });
            } catch (error) {
              reject(new Error('Failed to process image data'));
            }
          },
          'image/png',
          1.0
        );
      } catch (error) {
        reject(new Error('Failed to process image in canvas'));
      }
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    // Use the existing preview URL instead of creating a new one
    img.src = file.preview;
  });
}

function calculatePageSize(width: number, height: number) {
  const MAX_PAGE_WIDTH = PageSizes.A4[0];
  const MAX_PAGE_HEIGHT = PageSizes.A4[1];
  
  const ratio = Math.min(
    MAX_PAGE_WIDTH / width,
    MAX_PAGE_HEIGHT / height
  );
  
  return {
    width: width * ratio,
    height: height * ratio,
  };
}

export async function createPDFFromImages(files: FileWithPreview[]): Promise<Uint8Array> {
  if (!files || files.length === 0) {
    throw new Error('No files provided');
  }

  try {
    const pdfDoc = await PDFDocument.create();
    
    // Process images sequentially to prevent memory issues
    for (const file of files) {
      try {
        console.log(`Processing image: ${file.name}`);
        const processedImage = await processImage(file);
        
        // Calculate optimal page size
        const { width, height } = calculatePageSize(
          processedImage.width,
          processedImage.height
        );

        // Embed image
        const image = await pdfDoc.embedPng(processedImage.data);
        
        // Add page with calculated dimensions
        const page = pdfDoc.addPage([width, height]);
        
        // Draw image with proper positioning
        page.drawImage(image, {
          x: 0,
          y: 0,
          width,
          height,
        });

        console.log(`Successfully added ${file.name} to PDF`);
      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error);
        throw new Error(`Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    console.log('Generating final PDF...');
    const pdfBytes = await pdfDoc.save();
    console.log('PDF generated successfully');
    return pdfBytes;
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error(
      `Failed to create PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}