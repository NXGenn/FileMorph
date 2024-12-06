import { create } from 'zustand';
import { ConversionJob } from '../types';
import { ConversionService } from '../services/conversionService';
import toast from 'react-hot-toast';

interface Store {
  jobs: ConversionJob[];
  darkMode: boolean;
  addJob: (job: ConversionJob) => void;
  updateJob: (id: string, updates: Partial<ConversionJob>) => void;
  removeJob: (id: string) => void;
  toggleDarkMode: () => void;
  processJob: (job: ConversionJob) => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  jobs: [],
  darkMode: false,

  addJob: (job) => {
    set((state) => {
      const newJobs = [...state.jobs, job];
      // Start processing the job immediately
      get().processJob(job);
      return { jobs: newJobs };
    });
  },

  updateJob: (id, updates) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id ? { ...job, ...updates } : job
      ),
    })),

  removeJob: (id) =>
    set((state) => ({
      jobs: state.jobs.filter((job) => job.id !== id),
    })),

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  processJob: async (job) => {
    const { updateJob } = get();
    
    try {
      // Update status to processing
      updateJob(job.id, { status: 'processing', progress: 0 });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        const currentJob = get().jobs.find(j => j.id === job.id);
        if (currentJob && currentJob.progress < 90) {
          updateJob(job.id, { progress: currentJob.progress + 10 });
        }
      }, 500);

      // Perform the actual conversion
      const convertedBlob = await ConversionService.convertFile(
        job.sourceFile,
        job.targetFormat
      );

      clearInterval(progressInterval);

      // Create download link
      const downloadUrl = URL.createObjectURL(convertedBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = `converted.${job.targetFormat}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);

      // Update job status to completed
      updateJob(job.id, { status: 'completed', progress: 100 });
      toast.success('Conversion completed successfully');
    } catch (error) {
      updateJob(job.id, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Conversion failed',
        progress: 0,
      });
      toast.error('Conversion failed');
    }
  },
}));