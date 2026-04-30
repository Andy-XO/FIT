import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import DashboardPage from './pages/DashboardPage';

function App() {
  return <BrowserRouter><Routes><Route path="/" element={<DashboardPage />} /></Routes></BrowserRouter>;
}

createRoot(document.getElementById('root')).render(<App />);
