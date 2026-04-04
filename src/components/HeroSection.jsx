import { Button } from 'antd';
import { ArrowDownOutlined, RocketOutlined } from '@ant-design/icons';

export default function HeroSection() {
  const scrollToForm = () => {
    document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-badge">
          <RocketOutlined /> Automated Job Alerts for Fresh Graduates
        </div>
        <h1 className="hero-title">
          Never Miss Your<br />Dream Job Again
        </h1>
        <p className="hero-subtitle">
          Set your preferences once, and let JobPulse deliver curated job opportunities
          straight to you — tailored to your skills, location, and career goals.
        </p>
        <div className="hero-cta">
          <Button size="large" onClick={scrollToForm}>
            Get Started <ArrowDownOutlined />
          </Button>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">5,000+</div>
            <div className="hero-stat-label">Jobs Tracked</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">1,200+</div>
            <div className="hero-stat-label">Active Users</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">98%</div>
            <div className="hero-stat-label">Match Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}
