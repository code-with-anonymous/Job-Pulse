import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThunderboltOutlined, MailOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();

  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await resetPassword(email.trim());
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-card auth-card-center">
          <div className="auth-success-icon"><CheckCircleOutlined /></div>
          <h2 className="auth-title">Reset link sent!</h2>
          <p className="auth-subtitle" style={{ textAlign: 'center' }}>
            Check <strong>{email}</strong> for a password reset link.
            It may take a minute.
          </p>
          <Link to="/login" className="auth-btn" style={{ marginTop: 24, textAlign: 'center', display: 'block' }}>
            Back to Login
          </Link>
        </div>
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <span className="auth-logo-icon"><ThunderboltOutlined /></span>
          <span className="auth-logo-text">JobPulse</span>
        </div>

        <h1 className="auth-title">Reset password</h1>
        <p className="auth-subtitle">
          Enter your email and we'll send you a reset link.
        </p>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="forgot-email">Email address</label>
            <div className="auth-input-wrap">
              <MailOutlined className="auth-input-icon" />
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            id="forgot-submit"
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? <span className="auth-spinner" /> : 'Send Reset Link'}
          </button>
        </form>

        <p className="auth-switch">
          Remembered it?{' '}
          <Link to="/login">Go back to Login</Link>
        </p>
      </div>

      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
    </div>
  );
}
