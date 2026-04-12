import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ThunderboltOutlined,
  EyeOutlined, EyeInvisibleOutlined,
  MailOutlined, LockOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { signUp }    = useAuth();
  const navigate      = useNavigate();

  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [showPw,    setShowPw]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState(false);

  const passwordStrength = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8)           score++;
    if (/[A-Z]/.test(password))         score++;
    if (/[0-9]/.test(password))         score++;
    if (/[^A-Za-z0-9]/.test(password))  score++;
    return score;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength];
  const strengthClass = ['', 'pw-weak', 'pw-fair', 'pw-good', 'pw-strong'][passwordStrength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8)  { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    const { error: err } = await signUp(email.trim(), password);
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card auth-card-center">
          <div className="auth-success-icon"><CheckCircleOutlined /></div>
          <h2 className="auth-title">Check your email</h2>
          <p className="auth-subtitle" style={{ textAlign: 'center' }}>
            We sent a verification link to <strong>{email}</strong>.<br />
            Click it to activate your account, then sign in.
          </p>
          <button
            className="auth-btn"
            style={{ marginTop: 24 }}
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
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

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start tracking your job applications</p>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="auth-field">
            <label htmlFor="reg-email">Email address</label>
            <div className="auth-input-wrap">
              <MailOutlined className="auth-input-icon" />
              <input
                id="reg-email"
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
            <label htmlFor="reg-password">Password</label>
            <div className="auth-input-wrap">
              <LockOutlined className="auth-input-icon" />
              <input
                id="reg-password"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
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
            {/* Strength bar */}
            {password && (
              <div className="pw-strength-wrap">
                <div className="pw-strength-bar">
                  {[1,2,3,4].map(n => (
                    <div
                      key={n}
                      className={`pw-segment ${passwordStrength >= n ? strengthClass : ''}`}
                    />
                  ))}
                </div>
                <span className={`pw-label ${strengthClass}`}>{strengthLabel}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label htmlFor="reg-confirm">Confirm password</label>
            <div className="auth-input-wrap">
              <LockOutlined className="auth-input-icon" />
              <input
                id="reg-confirm"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repeat password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            id="register-submit"
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? <span className="auth-spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>

      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
    </div>
  );
}
