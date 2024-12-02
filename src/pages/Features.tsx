import React from 'react';
import { Link } from 'react-router-dom';
import { FileType, FileText, Images, Settings } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Features: React.FC = () => {
  const features = [
    {
      title: 'Format Conversion',
      description: 'Convert images between different formats like JPG, PNG, GIF, and WEBP.',
      icon: FileType,
      path: '/converter',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'PDF Creation',
      description: 'Combine multiple images into a single PDF document.',
      icon: FileText,
      path: '/converter',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Batch Processing',
      description: 'Process multiple images at once to save time.',
      icon: Images,
      path: '/converter',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Image Optimization',
      description: 'Optimize images while maintaining quality.',
      icon: Settings,
      path: '/converter',
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Choose Your Tool
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Select the feature you want to use from our image processing toolkit
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                to={feature.path}
                className="block"
              >
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 h-full border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg ${feature.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="ml-4 text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-6">
                    {feature.description}
                  </p>
                  <Button
                    variant="secondary"
                    className="w-full justify-center"
                  >
                    Use Tool
                    <Icon className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
};