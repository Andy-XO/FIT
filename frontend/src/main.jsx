import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { TrackerProvider } from './state/TrackerContext';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TrackerProvider>
      <App />
    </TrackerProvider>
  </React.StrictMode>
);
