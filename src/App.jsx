import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme as antTheme } from 'antd';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PreferencesForm from './components/PreferencesForm';
import Dashboard from './components/Dashboard';
import JobsTable from './components/JobsTable';

import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';

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
    <AuthProvider>
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
            {/* Public routes */}
            <Route path="/"                 element={<HomePage onSaved={handleSaved} />} />
            <Route path="/login"            element={<LoginPage />} />
            <Route path="/register"         element={<RegisterPage />} />
            <Route path="/forgot-password"  element={<ForgotPasswordPage />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard key={refreshKey} />
              </ProtectedRoute>
            } />
            <Route path="/jobs" element={
              <ProtectedRoute>
                <JobsTable />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="footer">
          Built with ❤️ by <a href="#">JobPulse</a> — Automated Job Alerts for Fresh Graduates
        </footer>
      </ConfigProvider>
    </AuthProvider>
  );
}
