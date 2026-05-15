import { SunOutlined, MoonOutlined, ThunderboltOutlined, LogoutOutlined, UserOutlined, HeartOutlined } from '@ant-design/icons';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ theme, toggleTheme }) {
  const location      = useLocation();
  const navigate      = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
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
        <div className="navbar-left">
          <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              JobPulse
          </div>

          <button
            className={`navbar-burger ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>

          <div className="navbar-links">
          {!isAuthPage && (
            <>
              <span
                className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
                onClick={() => { navigate('/'); setMobileOpen(false); }}
              >
                Preferences
              </span>
              <span
                className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}
              >
                Dashboard
              </span>
              <span
                className={`navbar-link ${location.pathname === '/jobs' ? 'active' : ''}`}
                onClick={() => { navigate('/jobs'); setMobileOpen(false); }}
              >
                Jobs
              </span>
              {user && (
                <span
                  className={`navbar-link ${location.pathname === '/favorite-jobs' ? 'active' : ''}`}
                  onClick={() => { navigate('/favorite-jobs'); setMobileOpen(false); }}
                >
                  <HeartOutlined style={{ marginRight: 4, color: '#eb2f96' }} />
                  Favourites
                </span>
              )}
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
              onClick={() => { navigate('/login'); setMobileOpen(false); }}
            >
              Sign In
            </span>
          )}

          </div>
        </div>

        <div className="navbar-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
          </button>
        </div>
      </div>

      {/* Mobile menu - duplicates primary links in a vertical panel on small screens */}
      <div className={`navbar-mobile ${mobileOpen ? 'open' : ''}`} role="menu">
        {!isAuthPage && (
          <>
            <div className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => { navigate('/'); setMobileOpen(false); }} role="menuitem">Preferences</div>
            <div className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={() => { navigate('/dashboard'); setMobileOpen(false); }} role="menuitem">Dashboard</div>
            <div className={`navbar-link ${location.pathname === '/jobs' ? 'active' : ''}`} onClick={() => { navigate('/jobs'); setMobileOpen(false); }} role="menuitem">Jobs</div>
            {user && (
              <div className={`navbar-link ${location.pathname === '/favorite-jobs' ? 'active' : ''}`} onClick={() => { navigate('/favorite-jobs'); setMobileOpen(false); }} role="menuitem">
                <HeartOutlined style={{ marginRight: 4, color: '#eb2f96' }} /> Favourites
              </div>
            )}
          </>
        )}

        {user ? (
          <div className="navbar-user-mobile">
            <div className="navbar-avatar" title={user.email}><UserOutlined /></div>
            <div className="navbar-email">{user.email}</div>
            <button className="navbar-logout-btn" onClick={() => { handleLogout(); setMobileOpen(false); }}>Sign out</button>
          </div>
        ) : (
          !isAuthPage && (
            <div className="navbar-link" onClick={() => { navigate('/login'); setMobileOpen(false); }}>Sign In</div>
          )
        )}

        <div className="mobile-theme-row">
          <button className="theme-toggle" onClick={() => { toggleTheme(); }} aria-label="Toggle theme">
            {theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
          </button>
        </div>
      </div>
    </nav>
  );
}
