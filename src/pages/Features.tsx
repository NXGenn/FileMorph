import React from 'react';
import { Link } from 'react-router-dom';
import { FileType, Video, Music, FileText, Image, FileSpreadsheet, FilePresentation, Book, Code } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Features: React.FC = () => {
  const features = [
    {
      title: 'Document Conversion',
      description: 'Convert between PDF, Word, Excel, PowerPoint, and EPUB formats.',
      icon: FileType,
      path: '/converter/document',
      color: 'bg-blue-100 text-blue-600',
      features: ['PDF to Word', 'Word to PDF', 'Excel to PDF', 'PowerPoint to PDF', 'EPUB to PDF'],
    },
    {
      title: 'Video Conversion',
      description: 'Convert videos between formats and extract audio.',
      icon: Video,
      path: '/converter/video',
      color: 'bg-purple-100 text-purple-600',
      features: ['MP4 to AVI', 'MKV to MP4', 'Extract Audio (MP3)', 'Video Compression'],
    },
    {
      title: 'Audio Conversion',
      description: 'Convert between various audio formats.',
      icon: Music,
      path: '/converter/audio',
      color: 'bg-pink-100 text-pink-600',
      features: ['WAV to MP3', 'AAC to FLAC', 'MP3 to WAV', 'Audio Quality Settings'],
    },
    {
      title: 'Text & Code Conversion',
      description: 'Convert between different text formats and encodings.',
      icon: FileText,
      path: '/converter/text',
      color: 'bg-green-100 text-green-600',
      features: ['JSON to XML', 'YAML to JSON', 'Text Encoding', 'Code Formatting'],
    },
    {
      title: 'Image Conversion',
      description: 'Convert images between formats and create PDFs.',
      icon: Image,
      path: '/converter',
      color: 'bg-orange-100 text-orange-600',
      features: ['JPG to PNG', 'WebP Support', 'Batch Processing', 'Image to PDF'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            All-in-One Conversion Suite
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Professional tools for all your conversion needs
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg ${feature.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="ml-4 text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {feature.features.map((item) => (
                      <li key={item} className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link to={feature.path}>
                    <Button
                      variant="secondary"
                      className="w-full justify-center"
                    >
                      Start Converting
                      <Icon className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};