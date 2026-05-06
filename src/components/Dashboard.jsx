import { useState, useEffect, useCallback } from 'react';
import { Tag, Button, Empty, Popconfirm, message, Spin } from 'antd';
import {
  CodeOutlined,
  EnvironmentOutlined,
  LaptopOutlined,
  DeleteOutlined,
  InboxOutlined,
  PlusOutlined,
  MailOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ReloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import CoverLetterModal from './CoverLetterModal';

const JOB_TYPE_LABELS = {
  'full-time':   { label: 'Full-time',   color: '#6366f1' },
  'part-time':   { label: 'Part-time',   color: '#f59e0b' },
  'remote':      { label: 'Remote',      color: '#10b981' },
  'internship':  { label: 'Internship',  color: '#ec4899' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [prefs,   setPrefs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Cover letter modal state
  const [coverModal, setCoverModal] = useState({ open: false, text: '', info: null });

  /* ── fetch preferences from Supabase ─────────────────── */
  const fetchPrefs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbErr } = await supabase
        .from('job_preferences')
        .select('*')
        .eq('email', user.email)
        .order('created_at', { ascending: false });

      if (sbErr) throw sbErr;
      setPrefs(data ?? []);
    } catch (err) {
      setError(err.message || 'Failed to fetch preferences.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPrefs();
  }, [fetchPrefs]);

  /* ── delete a preference ─────────────────────────────── */
  const deletePref = async (id) => {
    try {
      const { error: delErr } = await supabase
        .from('job_preferences')
        .delete()
        .eq('id', id);

      if (delErr) throw delErr;
      setPrefs((prev) => prev.filter((p) => p.id !== id));
      message.success('Preference deleted.');
    } catch (err) {
      message.error(err.message || 'Failed to delete.');
    }
  };

  /* ── clear all preferences ──────────────────────────── */
  const clearAll = async () => {
    try {
      const { error: delErr } = await supabase
        .from('job_preferences')
        .delete()
        .eq('email', user.email);

      if (delErr) throw delErr;
      setPrefs([]);
      message.success('All preferences cleared.');
    } catch (err) {
      message.error(err.message || 'Failed to clear all.');
    }
  };

  /* ── helpers ─────────────────────────────────────────── */
  const formatDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const openCoverLetter = (pref) => {
    setCoverModal({
      open: true,
      text: pref.cover_letter || '',
      info: {
        job_title: `${pref.job_type} — ${pref.location}`,
        company: pref.email,
      },
    });
  };

  /* ── loading state ──────────────────────────────────── */
  if (loading) {
    return (
      <div className="dashboard-section" style={{ textAlign: 'center', paddingTop: 100 }}>
        <Spin size="large" />
        <p style={{ color: 'var(--text-muted)', marginTop: 16 }}>Loading your preferences…</p>
      </div>
    );
  }

  /* ── empty state ────────────────────────────────────── */
  if (!error && prefs.length === 0) {
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

  /* ── main view ──────────────────────────────────────── */
  return (
    <div className="dashboard-section">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Your Saved Preferences</h2>
          <p>
            You have <strong>{prefs.length}</strong> saved configuration{prefs.length > 1 ? 's' : ''}.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button icon={<ReloadOutlined />} onClick={fetchPrefs}>
            Refresh
          </Button>
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
      </div>

      {/* Error banner */}
      {error && (
        <div className="jobs-error" style={{ marginBottom: 20 }}>
          <span>{error}</span>
          <button onClick={fetchPrefs}>Retry</button>
        </div>
      )}

      {/* Preferences table */}
      <div className="jobs-table-wrap">
        <table className="jobs-table" id="prefs-table">
          <thead>
            <tr>
              <th>#</th>
              <th><MailOutlined /> Email</th>
              <th><CodeOutlined /> Skills</th>
              <th><EnvironmentOutlined /> Location</th>
              <th><LaptopOutlined /> Job Type</th>
              <th><CalendarOutlined /> Date</th>
              <th><FileTextOutlined /> Cover Letter</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prefs.map((pref, idx) => {
              const jobInfo = JOB_TYPE_LABELS[pref.job_type] || { label: pref.job_type, color: '#6b7280' };
              const skills = pref.skills
                ? pref.skills.split(',').map((s) => s.trim()).filter(Boolean)
                : [];

              return (
                <tr key={pref.id} className="jobs-table-row">
                  <td className="jobs-idx">{idx + 1}</td>
                  <td className="jobs-email">
                    <MailOutlined className="td-icon" />
                    {pref.email}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {skills.map((skill) => (
                        <Tag key={skill} color="purple" style={{ margin: 0, fontSize: '0.78rem' }}>
                          {skill}
                        </Tag>
                      ))}
                    </div>
                  </td>
                  <td className="jobs-location">{pref.location || '—'}</td>
                  <td>
                    <Tag color={jobInfo.color}>{jobInfo.label}</Tag>
                  </td>
                  <td className="jobs-date">{formatDate(pref.created_at)}</td>
                  <td>
                    {pref.cover_letter ? (
                      <button
                        className="cover-letter-view-btn"
                        onClick={() => openCoverLetter(pref)}
                        id={`view-cover-${pref.id}`}
                      >
                        <EyeOutlined /> View Cover Letter
                      </button>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>—</span>
                    )}
                  </td>
                  <td>
                    <Popconfirm
                      title="Delete this preference?"
                      onConfirm={() => deletePref(pref.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <button className="pref-delete-btn" aria-label="Delete" id={`delete-pref-${pref.id}`}>
                        <DeleteOutlined />
                      </button>
                    </Popconfirm>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cover Letter Modal */}
      <CoverLetterModal
        open={coverModal.open}
        onClose={() => setCoverModal({ open: false, text: '', info: null })}
        coverLetter={coverModal.text}
        jobInfo={coverModal.info}
      />
    </div>
  );
}
