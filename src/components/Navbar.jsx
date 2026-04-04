import { SunOutlined, MoonOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Navbar({ theme, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();

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
