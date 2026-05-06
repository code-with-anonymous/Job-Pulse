import { Modal } from 'antd';
import { FileTextOutlined, PrinterOutlined, CloseOutlined } from '@ant-design/icons';

/**
 * CoverLetterModal
 * Renders the stored cover letter text in a styled, PDF-like document viewer.
 *
 * Props:
 *  - open          {boolean}   Modal visibility flag
 *  - onClose       {function}  Called when user closes the modal
 *  - coverLetter   {string}    Raw cover letter text
 *  - jobInfo       {object}    { job_title, company } for the modal title (optional)
 */
export default function CoverLetterModal({ open, onClose, coverLetter, jobInfo }) {
  const handlePrint = () => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>Cover Letter${jobInfo?.job_title ? ` — ${jobInfo.job_title}` : ''}</title>
          <style>
            body {
              font-family: 'Georgia', serif;
              max-width: 720px;
              margin: 60px auto;
              color: #1a1a2e;
              line-height: 1.9;
              font-size: 15px;
            }
            pre { white-space: pre-wrap; word-break: break-word; }
          </style>
        </head>
        <body><pre>${coverLetter ?? ''}</pre></body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={780}
      closeIcon={<CloseOutlined />}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileTextOutlined style={{ color: '#6366f1', fontSize: 18 }} />
          <span>
            Cover Letter
            {jobInfo?.job_title && (
              <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: 6 }}>
                — {jobInfo.job_title}
                {jobInfo.company ? ` @ ${jobInfo.company}` : ''}
              </span>
            )}
          </span>
        </div>
      }
      styles={{ body: { padding: 0 } }}
    >
      {/* Document wrapper */}
      <div className="cover-letter-doc">
        {/* Toolbar */}
        <div className="cover-letter-toolbar">
          <span className="cover-letter-doc-label">
            <FileTextOutlined /> Document View
          </span>
          <button
            className="cover-letter-print-btn"
            onClick={handlePrint}
            title="Print / Save as PDF"
          >
            <PrinterOutlined /> Print / PDF
          </button>
        </div>

        {/* Paper */}
        <div className="cover-letter-paper">
          {coverLetter ? (
            <pre className="cover-letter-text">{coverLetter}</pre>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No cover letter provided.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
