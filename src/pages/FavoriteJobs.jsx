// src/pages/FavoriteJobs.jsx
import React from 'react';
import { Table, Spin, Empty } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { useFavorites } from '../hooks/useFavorites';
import { FavoriteButton } from '../components/FavoriteButton';
import './FavoriteJobs.css';

export const FavoriteJobs = () => {
  const { favorites, loading } = useFavorites();

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 40,
      render: (_, __, idx) => idx + 1,
    },
    {
      title: 'Job Title',
      dataIndex: ['jobs', 'job_title'],
      key: 'title',
      render: (text) => <span className="fav-title">{text || '—'}</span>,
    },
    {
      title: 'Company',
      dataIndex: ['jobs', 'company'],
      key: 'company',
      render: (text) => <span>{text || '—'}</span>,
    },
    {
      title: 'Location',
      dataIndex: ['jobs', 'location'],
      key: 'location',
      render: (text) => <span>{text || '—'}</span>,
    },
    {
      title: 'Date',
      dataIndex: ['jobs', 'date'],
      key: 'date',
      render: (date) => {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <>
          <FavoriteButton jobId={row.jobs.id} />
          {row.jobs.job_url && (
            <a
              href={row.jobs.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="fav-link-btn"
            >
              <LinkOutlined />
            </a>
          )}
        </>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="fav-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="fav-empty">
        <Empty description="You have no favourite jobs yet" />
      </div>
    );
  }

  return (
    <section className="fav-page-section">
      <h2 className="fav-page-title">Your Favourite Jobs</h2>
      <Table
        dataSource={favorites}
        columns={columns}
        pagination={false}
        rowKey={(record) => record.id}
        className="fav-table"
        scroll={{ x: true }}
      />
    </section>
  );
};

export default FavoriteJobs;
