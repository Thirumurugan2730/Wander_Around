import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState() {
  return (
    <div className="empty-state-card card-enter">
      <div className="empty-sun-icon" aria-hidden="true">
        ☀️
      </div>
      
      <h2 className="empty-title">It's quiet here.</h2>
      
      <p className="empty-body">
        The day hasn't filled up with memories yet.
        <br />
        Be the first to leave a little piece of yours.
      </p>

      <div className="empty-action">
        <Link to="/share" className="btn btn-sun">
          Leave today's first moment
        </Link>
      </div>

      <style>{`
        .empty-state-card {
          max-width: 500px;
          margin: 60px auto;
          padding: 48px 32px;
          background: var(--paper-white);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-polaroid);
          text-align: center;
          border: 1px solid rgba(43, 40, 37, 0.08);
          position: relative;
        }

        .empty-sun-icon {
          font-size: 3rem;
          margin-bottom: 16px;
          display: inline-block;
          animation: floatGentle 4s ease-in-out infinite;
        }

        .empty-title {
          font-size: 1.75rem;
          color: var(--ink-dark);
          margin-bottom: 12px;
        }

        .empty-body {
          font-size: 1.05rem;
          color: var(--ink-medium);
          line-height: 1.6;
          margin-bottom: 28px;
        }

        .empty-action {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
