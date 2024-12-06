import React from 'react';
import { motion } from 'framer-motion';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      title: 'Document Conversion',
      description: 'Convert between PDF, Word, Excel, and PowerPoint formats with ease.',
      icon: '📄'
    },
    {
      title: 'Image Processing',
      description: 'Transform images between different formats and optimize quality.',
      icon: '🖼️'
    },
    {
      title: 'Audio & Video',
      description: 'Convert audio and video files to different formats.',
      icon: '🎵'
    },
    {
      title: 'Text & Code',
      description: 'Convert between different text and code formats.',
      icon: '📝'
    },
    {
      title: 'Batch Processing',
      description: 'Convert multiple files simultaneously to save time.',
      icon: '📦'
    },
    {
      title: 'No Installation',
      description: 'Use directly in your browser without installing any software.',
      icon: '🌐'
    }
  ];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl"
          >
            Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300"
          >
            Everything you need to convert and transform your files
          </motion.p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="pt-6"
              >
                <div className="flow-root bg-white dark:bg-gray-800 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg text-3xl">
                        {feature.icon}
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};