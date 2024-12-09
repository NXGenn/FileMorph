import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Features } from './pages/Features';
import { DocumentConverter } from './pages/DocumentConverter';
import { VideoConverter } from './pages/VideoConverter';
import { AudioConverter } from './pages/AudioConverter';
import { TextConverter } from './pages/TextConverter';
import { Converter } from './pages/Converter';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <Navigate to="/" />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/features',
        element: <Features />,
      },
      {
        path: '/converter',
        element: <Converter />,
      },
      {
        path: '/converter/document',
        element: <DocumentConverter />,
      },
      {
        path: '/converter/video',
        element: <VideoConverter />,
      },
      {
        path: '/converter/audio',
        element: <AudioConverter />,
      },
      {
        path: '/converter/text',
        element: <TextConverter />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);