import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2, FileType, Video, Music, FileText, Image, ArrowRight, Zap, Shield, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
  const features = [
    {
      icon: FileType,
      title: 'Document Conversion',
      description: 'Transform documents between formats effortlessly',
      path: '/converter/document',
    },
    {
      icon: Video,
      title: 'Video & Audio',
      description: 'Convert media files with perfect quality',
      path: '/converter/video',
    },
    {
      icon: FileText,
      title: 'Text & Code',
      description: 'Convert between data formats instantly',
      path: '/converter/text',
    },
    {
      icon: Image,
      title: 'Image Processing',
      description: 'Transform images with precision',
      path: '/converter',
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Transform files instantly with our optimized engine',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your files never leave your device - 100% private',
    },
    {
      icon: Clock,
      title: 'Batch Processing',
      description: 'Convert multiple files simultaneously',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Wand2 className="h-16 w-16 animate-pulse" />
            </div>
            <h1 className="text-5xl font-extrabold sm:text-6xl lg:text-7xl">
              FileMorph
              <span className="block text-blue-200 mt-2">Magical File Transformation</span>
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
              Transform any file format instantly with our powerful conversion suite. Experience the magic of seamless file conversion.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link to="/features">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Discover the Magic
                  <Wand2 className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="secondary" className="bg-blue-500 text-white hover:bg-blue-400">
                  Start Converting
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="relative h-16">
          <svg className="absolute bottom-0 w-full h-16" preserveAspectRatio="none" viewBox="0 0 1440 54">
            <path fill="white" d="M0 54h1440V0c-192 36-384 54-576 54-192 0-384-18-576-54v54z" />
          </svg>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Transform Any File
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              One platform for all your conversion needs
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  to={feature.path}
                  className="group transform hover:scale-105 transition-all duration-200"
                >
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-500 hover:shadow-lg">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};