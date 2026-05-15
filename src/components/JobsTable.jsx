import { useEffect, useState, useCallback } from 'react';
import {
  SearchOutlined,
  ReloadOutlined,
  LinkOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  BankOutlined,
  MailOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import CoverLetterModal from './CoverLetterModal';
import ReactMarkdown from 'react-markdown';
import { FavoriteButton } from './FavoriteButton';
import remarkGfm from 'remark-gfm';

/* ─── Custom Markdown Components ─────────────────────── */
const markdownComponents = {
  // Tables
  table: ({ children }) => (
    <div className="md-table-wrap">
      <table className="md-table">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="md-thead">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr:   ({ children }) => <tr className="md-tr">{children}</tr>,
  th:   ({ children }) => <th className="md-th">{children}</th>,
  td:   ({ children }) => <td className="md-td">{children}</td>,
  // Headings — keep hierarchy but compact
  h1: ({ children }) => <h2 className="md-h md-h1">{children}</h2>,
  h2: ({ children }) => <h3 className="md-h md-h2">{children}</h3>,
  h3: ({ children }) => <h4 className="md-h md-h3">{children}</h4>,
  h4: ({ children }) => <p  className="md-h md-h4">{children}</p>,
  // Paragraphs & inline
  p:      ({ children }) => <p className="md-p">{children}</p>,
  strong: ({ children }) => <strong className="md-strong">{children}</strong>,
  em:     ({ children }) => <em className="md-em">{children}</em>,
  // Lists
  ul: ({ children }) => <ul className="md-ul">{children}</ul>,
  ol: ({ children }) => <ol className="md-ol">{children}</ol>,
  li: ({ children }) => <li className="md-li">{children}</li>,
  // Code
  code: ({ inline, children }) =>
    inline
      ? <code className="md-code-inline">{children}</code>
      : <pre className="md-code-block"><code>{children}</code></pre>,
  // Horizontal rule
  hr: () => <hr className="md-hr" />,
};

/* ─── ReadMore Component ──────────────────────────────── */
const WORD_LIMIT = 100;

function ReadMore({ text }) {
  const [expanded, setExpanded] = useState(false);

  const words = text.split(/\s+/);
  const isLong = words.length > WORD_LIMIT;
  const preview = isLong && !expanded
    ? words.slice(0, WORD_LIMIT).join(' ') + '…'
    : text;

  return (
    <div className="job-description">
      <div className={`md-content${expanded || !isLong ? '' : ' md-content-collapsed'}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {preview}
        </ReactMarkdown>
      </div>
      {isLong && (
        <button
          className="read-more-btn"
          onClick={() => setExpanded(prev => !prev)}
        >
          {expanded ? '↑ Read less' : '↓ Read more'}
        </button>
      )}
    </div>
  );
}

/* ─── helpers ─────────────────────────────────────────── */
function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function StatusBadge({ value }) {
  if (!value) return <span className="badge badge-pending">Pending</span>;
  const v = String(value).toLowerCase();
  if (v.includes('applied') || v === 'yes' || v === 'true')
    return <span className="badge badge-applied"><CheckCircleOutlined /> Applied</span>;
  if (v.includes('sent'))
    return <span className="badge badge-sent"><FileDoneOutlined /> Sent</span>;
  return <span className="badge badge-pending"><ClockCircleOutlined /> {value}</span>;
}

/* ─── Component ───────────────────────────────────────── */
export default function JobsTable() {
  const { user } = useAuth();            // ← logged-in user
  const [jobs, setJobs]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  // Cover letter modal state
  const [coverModal, setCoverModal] = useState({ open: false, text: '', info: null });

  const fetchJobs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbErr } = await supabase
        .from('jobs')
        .select(
          'id, job_title, company, location, job_url, description, cover_letter, applied_for, sent_to, date, user_email'
        )
        // Only fetch THIS user's jobs by matching their email
        .eq('user_email', user.email)
        .order('date', { ascending: false });

      if (sbErr) throw sbErr;
      setJobs(data ?? []);
    } catch (err) {
      setError(err.message || 'Failed to fetch jobs.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  /* filtered list */
  const filtered = jobs.filter((j) => {
    const q = search.toLowerCase();
    return (
      (j.job_title ?? '').toLowerCase().includes(q) ||
      (j.company ?? '').toLowerCase().includes(q) ||
      (j.location ?? '').toLowerCase().includes(q)
    );
  });

  /* ─── RENDER ──────────────────────────────────────────── */
  return (
    <section className="jobs-section">
      {/* Header */}
      <div className="jobs-header">
        <div>
          <h2>
            <span className="jobs-header-icon"><FileDoneOutlined /></span>
            Applied Jobs
          </h2>
          <p>
            {loading
              ? 'Loading your applications…'
              : `${filtered.length} job${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        <div className="jobs-controls">
          <div className="jobs-search-wrap">
            <SearchOutlined className="jobs-search-icon" />
            <input
              id="jobs-search"
              className="jobs-search"
              placeholder="Search title, company, location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            id="jobs-refresh-btn"
            className="jobs-refresh-btn"
            onClick={fetchJobs}
            disabled={loading}
            aria-label="Refresh jobs"
          >
            <ReloadOutlined spin={loading} />
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="jobs-error">
          <ExclamationCircleOutlined />
          <span>{error}</span>
          <button onClick={fetchJobs}>Retry</button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !error && (
        <div className="jobs-skeleton-wrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="jobs-skeleton-row">
              <div className="skel skel-title" />
              <div className="skel skel-company" />
              <div className="skel skel-sm" />
              <div className="skel skel-sm" />
              <div className="skel skel-badge" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="jobs-empty">
          <div className="jobs-empty-icon">📭</div>
          <h3>{search ? 'No matching jobs' : 'No jobs yet'}</h3>
          <p>
            {search
              ? 'Try a different search term.'
              : 'Jobs submitted via n8n will appear here automatically.'}
          </p>
          {search && (
            <button className="jobs-clear-btn" onClick={() => setSearch('')}>
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && !error && filtered.length > 0 && (
        <div className="jobs-table-wrap">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Job Title</th>
                <th>Company</th>
                <th><EnvironmentOutlined /> Location</th>
                <th><CalendarOutlined /> Date</th>
                <th>Applied</th>
                <th>Sent To</th>
                <th>Cover Letter</th>
                <th>Fav</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job, idx) => (
                <tr
                  key={job.id}
                  className="jobs-table-row"
                  onClick={() => setSelectedJob(job)}
                  title="Click to view details"
                >
                  <td className="jobs-idx">{idx + 1}</td>
                  <td className="jobs-title">{job.job_title || '—'}</td>
                  <td className="jobs-company">
                    <BankOutlined className="td-icon" />
                    {job.company || '—'}
                  </td>
                  <td className="jobs-location">{job.location || '—'}</td>
                  <td className="jobs-date">{formatDate(job.date)}</td>
                  <td><StatusBadge value={job.applied_for} /></td>
                  <td className="jobs-email">
                    {job.sent_to
                      ? <span><MailOutlined className="td-icon" />{job.sent_to}</span>
                      : '—'}
                  </td>
                  <td>
                    {job.cover_letter ? (
                      <button
                        className="cover-letter-view-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCoverModal({
                            open: true,
                            text: job.cover_letter,
                            info: { job_title: job.job_title, company: job.company },
                          });
                        }}
                        id={`view-cover-${job.id}`}
                      >
                        <EyeOutlined /> View
                      </button>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>—</span>
                    )}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <FavoriteButton jobId={job.id} />
                  </td>
                  <td>
                    {job.job_url ? (
                      <a
                        href={job.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="jobs-link-btn"
                        onClick={(e) => e.stopPropagation()}
                        id={`job-link-${job.id}`}
                      >
                        <LinkOutlined />
                      </a>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedJob && (
        <div className="jobs-modal-overlay" onClick={() => setSelectedJob(null)}>
          <div
            className="jobs-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              id="jobs-modal-close"
              className="jobs-modal-close"
              onClick={() => setSelectedJob(null)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="jobs-modal-header">
              <span className="jobs-modal-icon"><FileDoneOutlined /></span>
              <div>
                <h3>{selectedJob.job_title}</h3>
                <p>{selectedJob.company} · {selectedJob.location || 'Location N/A'}</p>
              </div>
            </div>

            <div className="jobs-modal-meta">
              {selectedJob.date && (
                <span><CalendarOutlined /> {formatDate(selectedJob.date)}</span>
              )}
              {selectedJob.user_email && (
                <span><MailOutlined /> {selectedJob.user_email}</span>
              )}
              {selectedJob.sent_to && (
                <span><MailOutlined /> Sent to: {selectedJob.sent_to}</span>
              )}
              {selectedJob.applied_for && (
                <StatusBadge value={selectedJob.applied_for} />
              )}
            </div>

            {selectedJob.description && (
              <div className="jobs-modal-section">
                <h4>Job Description</h4>
                <ReadMore text={selectedJob.description} />
              </div>
            )}

            {selectedJob.cover_letter && (
              <div className="jobs-modal-section">
                <h4>Cover Letter</h4>
                <button
                  className="cover-letter-view-btn"
                  style={{ marginTop: 4 }}
                  onClick={() => {
                    setCoverModal({
                      open: true,
                      text: selectedJob.cover_letter,
                      info: { job_title: selectedJob.job_title, company: selectedJob.company },
                    });
                  }}
                >
                  <EyeOutlined /> View Cover Letter
                </button>
              </div>
            )}

            {selectedJob.job_url && (
              <a
                href={selectedJob.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="jobs-modal-link-btn"
                id={`jobs-modal-link-${selectedJob.id}`}
              >
                <LinkOutlined /> View Job Posting
              </a>
            )}
          </div>
        </div>
      )}

      {/* Cover Letter Modal */}
      <CoverLetterModal
        open={coverModal.open}
        onClose={() => setCoverModal({ open: false, text: '', info: null })}
        coverLetter={coverModal.text}
        jobInfo={coverModal.info}
      />
    </section>
  );
}
