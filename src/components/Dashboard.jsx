import { useState, useEffect } from 'react';
import { Tag, Button, Empty, Popconfirm, message } from 'antd';
import {
  CodeOutlined,
  EnvironmentOutlined,
  LaptopOutlined,
  DeleteOutlined,
  InboxOutlined,
  PlusOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const JOB_TYPE_LABELS = {
  'full-time': { label: 'Full-time', color: '#6366f1' },
  'part-time': { label: 'Part-time', color: '#f59e0b' },
  'remote': { label: 'Remote', color: '#10b981' },
  'internship': { label: 'Internship', color: '#ec4899' },
};

export default function Dashboard() {
  const [prefs, setPrefs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('jobpulse_prefs') || '[]');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefs(data);
  }, []);

  const deletePref = (index) => {
    const updated = prefs.filter((_, i) => i !== index);
    localStorage.setItem('jobpulse_prefs', JSON.stringify(updated));
    setPrefs(updated);
    message.success('Preference deleted.');
  };

  const clearAll = () => {
    localStorage.removeItem('jobpulse_prefs');
    setPrefs([]);
    message.success('All preferences cleared.');
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (prefs.length === 0) {
    return (
      <div className="dashboard-section">
        <div className="dashboard-header">
          <h2>Your Saved Preferences</h2>
          <p>View and manage your job alert configurations.</p>
        </div>
        <div className="empty-dashboard">
          <div className="empty-dashboard-icon">
            <InboxOutlined />
          </div>
          <h3>No preferences saved yet</h3>
          <p>Set your job preferences to start receiving curated job alerts.</p>
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => navigate('/')}>
            Add Preferences
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Your Saved Preferences</h2>
          <p>
            You have <strong>{prefs.length}</strong> saved configuration{prefs.length > 1 ? 's' : ''}.
          </p>
        </div>
        <Popconfirm
          title="Clear all preferences?"
          description="This action cannot be undone."
          onConfirm={clearAll}
          okText="Yes, clear all"
          cancelText="Cancel"
        >
          <Button danger icon={<DeleteOutlined />}>
            Clear All
          </Button>
        </Popconfirm>
      </div>

      {prefs.map((pref, idx) => {
        const jobInfo = JOB_TYPE_LABELS[pref.jobType] || { label: pref.jobType, color: '#6b7280' };
        return (
          <div className="pref-card" key={idx} style={{ animationDelay: `${idx * 0.08}s` }}>
            <div className="pref-card-header">
              <span className="pref-card-title">Preference #{prefs.length - idx}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="pref-card-time">{formatDate(pref.submittedAt)}</span>
                <Popconfirm
                  title="Delete this preference?"
                  onConfirm={() => deletePref(idx)}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined style={{ color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14 }} />
                </Popconfirm>
              </div>
            </div>

            {/* Email row */}
            <div className="pref-row">
              <div className="pref-row-icon email">
                <MailOutlined />
              </div>
              <div>
                <div className="pref-row-label">Email</div>
                <div className="pref-row-value">{pref.email}</div>
              </div>
            </div>

            {/* Skills row */}
            <div className="pref-row">
              <div className="pref-row-icon skills">
                <CodeOutlined />
              </div>
              <div>
                <div className="pref-row-label">Skills</div>
                <div className="pref-row-value">
                  {pref.skills.map((skill) => (
                    <Tag key={skill} color="purple" style={{ marginBottom: 4 }}>
                      {skill}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>

            {/* Location row */}
            <div className="pref-row">
              <div className="pref-row-icon location">
                <EnvironmentOutlined />
              </div>
              <div>
                <div className="pref-row-label">Location</div>
                <div className="pref-row-value">{pref.location}</div>
              </div>
            </div>

            {/* Job Type row */}
            <div className="pref-row">
              <div className="pref-row-icon job-type">
                <LaptopOutlined />
              </div>
              <div>
                <div className="pref-row-label">Job Type</div>
                <div className="pref-row-value">
                  <Tag color={jobInfo.color}>{jobInfo.label}</Tag>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
