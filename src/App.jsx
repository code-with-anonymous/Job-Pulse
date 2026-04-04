import { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme as antTheme } from 'antd';
import './App.css';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PreferencesForm from './components/PreferencesForm';
import Dashboard from './components/Dashboard';

function HomePage({ onSaved }) {
  return (
    <>
      <HeroSection />
      <PreferencesForm onSaved={onSaved} />
    </>
  );
}

export default function App() {
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('jobpulse_theme') || 'light';
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    localStorage.setItem('jobpulse_theme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSaved = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: themeMode === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#6366f1',
          borderRadius: 10,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
      }}
    >
      <Navbar theme={themeMode} toggleTheme={toggleTheme} />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage onSaved={handleSaved} />} />
          <Route path="/dashboard" element={<Dashboard key={refreshKey} />} />
        </Routes>
      </main>

      <footer className="footer">
        Built with ❤️ by <a href="#">JobPulse</a> — Automated Job Alerts for Fresh Graduates
      </footer>
    </ConfigProvider>
  );
}
