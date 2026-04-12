import { SunOutlined, MoonOutlined, ThunderboltOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ theme, toggleTheme }) {
  const location      = useLocation();
  const navigate      = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Pages where we hide the main nav links (auth pages)
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">
            <ThunderboltOutlined />
          </span>
          JobPulse
        </div>

        <div className="navbar-links">
          {!isAuthPage && (
            <>
              <span
                className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
                onClick={() => navigate('/')}
              >
                Preferences
              </span>
              <span
                className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </span>
              <span
                className={`navbar-link ${location.pathname === '/jobs' ? 'active' : ''}`}
                onClick={() => navigate('/jobs')}
              >
                Jobs
              </span>
            </>
          )}

          {/* User avatar + logout when signed in */}
          {user && (
            <div className="navbar-user">
              <div className="navbar-avatar" title={user.email}>
                <UserOutlined />
              </div>
              <span className="navbar-email">{user.email}</span>
              <button
                id="navbar-logout-btn"
                className="navbar-logout-btn"
                onClick={handleLogout}
                title="Sign out"
                aria-label="Sign out"
              >
                <LogoutOutlined />
              </button>
            </div>
          )}

          {/* Sign In link when not logged in and not on auth page */}
          {!user && !isAuthPage && (
            <span
              className="navbar-link navbar-signin-link"
              onClick={() => navigate('/login')}
            >
              Sign In
            </span>
          )}

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
          </button>
        </div>
      </div>
    </nav>
  );
}
