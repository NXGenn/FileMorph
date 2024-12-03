import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Wand2 } from 'lucide-react';

export const Layout: React.FC = () => {
  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 to-purple-600">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <Wand2 className="h-8 w-8 text-white" />
                <span className="ml-2 text-xl font-bold text-white">
                  FileMorph
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/features"
                className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Features
              </Link>
              <Link
                to="/converter"
                className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Start Converting
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>FileMorph - Transform Your Files with Ease</p>
            <p className="mt-1">© {new Date().getFullYear()} FileMorph. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};