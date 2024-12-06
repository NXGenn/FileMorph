import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive(path)
        ? 'bg-gray-900 text-white dark:bg-gray-700'
        : 'text-gray-700 hover:bg-gray-700 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700'
    }`;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FileMorph</h1>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link to="/" className={navLinkClass('/')}>Home</Link>
                <Link to="/features" className={navLinkClass('/features')}>Features</Link>
                <Link to="/convert/documents" className={navLinkClass('/convert/documents')}>Documents</Link>
                <Link to="/convert/images" className={navLinkClass('/convert/images')}>Images</Link>
                <Link to="/convert/media" className={navLinkClass('/convert/media')}>Media</Link>
                <Link to="/convert/code" className={navLinkClass('/convert/code')}>Code</Link>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};