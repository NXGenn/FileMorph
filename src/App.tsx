import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { FeaturesPage } from './pages/FeaturesPage';
import { DocumentConversion } from './pages/DocumentConversion';
import { ImageConversion } from './pages/ImageConversion';
import { AudioVideoConversion } from './pages/AudioVideoConversion';
import { TextCodeConversion } from './pages/TextCodeConversion';
import { useStore } from './store/useStore';

function App() {
  const { darkMode } = useStore();

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/convert/documents" element={<DocumentConversion />} />
              <Route path="/convert/images" element={<ImageConversion />} />
              <Route path="/convert/media" element={<AudioVideoConversion />} />
              <Route path="/convert/code" element={<TextCodeConversion />} />
            </Routes>
          </Layout>
        </Router>
        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export default App;