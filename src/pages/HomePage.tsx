import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const HomePage: React.FC = () => {
  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-8">
          Transform Your Files with <span className="text-blue-600">FileMorph</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
          Convert, edit, and optimize your files instantly. No installation needed.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/convert/documents"
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-4">Document Conversion</h2>
            <p className="text-gray-600 dark:text-gray-300">Convert between PDF, Word, Excel, and more</p>
          </Link>
          
          <Link
            to="/convert/images"
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-4">Image Conversion</h2>
            <p className="text-gray-600 dark:text-gray-300">Transform images between different formats</p>
          </Link>
          
          <Link
            to="/convert/media"
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-4">Audio & Video</h2>
            <p className="text-gray-600 dark:text-gray-300">Convert audio and video files</p>
          </Link>
          
          <Link
            to="/convert/code"
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-4">Text & Code</h2>
            <p className="text-gray-600 dark:text-gray-300">Convert between different text formats</p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};