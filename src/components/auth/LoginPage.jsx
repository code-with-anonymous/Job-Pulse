import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThunderboltOutlined, EyeOutlined, EyeInvisibleOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate  = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(email.trim(), password);
    setLoading(false);
    if (err) { setError(err.message); return; }
    navigate('/jobs');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <span className="auth-logo-icon"><ThunderboltOutlined /></span>
          <span className="auth-logo-text">JobPulse</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to view your applied jobs</p>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="auth-field">
            <label htmlFor="login-email">Email address</label>
            <div className="auth-input-wrap">
              <MailOutlined className="auth-input-icon" />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className="auth-field-row">
              <label htmlFor="login-password">Password</label>
              <Link to="/forgot-password" className="auth-forgot-link">Forgot password?</Link>
            </div>
            <div className="auth-input-wrap">
              <LockOutlined className="auth-input-icon" />
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="auth-pw-toggle"
                onClick={() => setShowPw(v => !v)}
                aria-label="Toggle password visibility"
              >
                {showPw ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </button>
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? <span className="auth-spinner" /> : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register">Create one free</Link>
        </p>
      </div>

      {/* Background orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
    </div>
  );
}
