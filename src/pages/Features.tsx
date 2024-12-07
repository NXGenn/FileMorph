import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileType,
  Video,
  Music,
  FileText,
  Image,
  FileSpreadsheet,
  FileCheck,
  Wand2,
  Shield,
  Zap,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.FC;
  path: string;
  color: string;
  features: string[];
  comingSoon?: boolean;
}

export const Features: React.FC = () => {
  const features: FeatureCard[] = [
    {
      title: 'Document Conversion',
      description: 'Convert between PDF, Word, and Excel formats with high precision.',
      icon: FileType,
      path: '/converter/document',
      color: 'bg-blue-100 text-blue-600',
      features: [
        'PDF to Word with formatting',
        'Word to PDF conversion',
        'Excel to PDF with tables',
        'PDF to Excel extraction',
        'Multi-page support',
        'Format preservation'
      ],
    },
    {
      title: 'Image Processing',
      description: 'Transform images with professional quality and batch processing.',
      icon: Image,
      path: '/converter',
      color: 'bg-orange-100 text-orange-600',
      features: [
        'JPG/JPEG conversion',
        'PNG optimization',
        'WebP support',
        'Batch processing',
        'PDF creation',
        'Quality control'
      ],
    },
    {
      title: 'Text & Data',
      description: 'Convert between different text and data formats seamlessly.',
      icon: FileText,
      path: '/converter/text',
      color: 'bg-green-100 text-green-600',
      features: [
        'JSON to XML/YAML',
        'XML to JSON',
        'YAML to JSON',
        'Text encoding',
        'UTF-8 support',
        'Format validation'
      ],
    },
    {
      title: 'Audio Processing',
      description: 'Convert and optimize audio files with precision.',
      icon: Music,
      path: '/converter/audio',
      color: 'bg-pink-100 text-pink-600',
      features: [
        'MP3 conversion',
        'WAV processing',
        'AAC support',
        'Quality control',
        'Metadata handling',
        'Batch conversion'
      ],
    },
    {
      title: 'Video Conversion',
      description: 'Professional video format conversion and compression.',
      icon: Video,
      path: '/converter/video',
      color: 'bg-purple-100 text-purple-600',
      features: [
        'MP4 conversion',
        'AVI processing',
        'Audio extraction',
        'Format optimization',
        'Quality settings',
        'Metadata preservation'
      ],
      comingSoon: true,
    },
    
    {
      title: 'Spreadsheet Tools',
      description: 'Advanced spreadsheet conversion and formatting.',
      icon: FileSpreadsheet,
      path: '/converter/document',
      color: 'bg-emerald-100 text-emerald-600',
      features: [
        'Excel to PDF',
        'CSV processing',
        'Table extraction',
        'Format preservation',
        'Multi-sheet support',
        'Data validation'
      ],
      comingSoon: true,

    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process files instantly with our optimized conversion engine',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'All processing happens in your browser - files never leave your device',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Clock,
      title: 'Batch Processing',
      description: 'Convert multiple files simultaneously with consistent quality',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: FileCheck,
      title: 'Format Fidelity',
      description: 'Maintain document formatting and quality during conversion',
      color: 'bg-green-100 text-green-600',
    },
  ];

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <Wand2 className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Powerful Conversion Suite
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your files with professional-grade tools designed for precision and efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                  <div
                      key={feature.title}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden group"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className={`p-3 rounded-lg ${feature.color} transition-colors group-hover:bg-opacity-80`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h2 className="ml-4 text-xl font-semibold text-gray-900">
                          {feature.title}
                          {feature.comingSoon && (
                              <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          Coming Soon
                        </span>
                          )}
                        </h2>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {feature.description}
                      </p>
                      <ul className="space-y-2 mb-6">
                        {feature.features.map((item) => (
                            <li key={item} className="flex items-center text-sm text-gray-600">
                              <span className="mr-2 text-blue-500">•</span>
                              {item}
                            </li>
                        ))}
                      </ul>
                      <Link to={feature.path}>
                        <Button
                            variant="secondary"
                            className="w-full justify-center group-hover:bg-gray-100"
                        >
                          {feature.comingSoon ? 'Coming Soon' : 'Start Converting'}
                          {!feature.comingSoon && <ArrowRight className="ml-2 w-4 h-4" />}
                        </Button>
                      </Link>
                    </div>
                  </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
              Why Choose FileMorph?
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                    <div key={benefit.title} className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className={`p-4 rounded-xl ${benefit.color}`}>
                          <Icon className="w-8 h-8" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                );
              })}
            </div>
          </div>

          <div className="text-center">
            <Link to="/converter">
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                Start Converting Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
  );
};