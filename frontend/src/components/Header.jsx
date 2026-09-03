import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="site-logo" aria-label="Daily Wander Home">
          <div className="logo-cloud">
            <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
              <path
                d="M24 22H10C7.23858 22 5 19.7614 5 17C5 14.4485 6.9121 12.3432 9.3922 12.0441C10.1584 8.57585 13.2723 6 17 6C21.4183 6 25 9.58172 25 14C25 14.1721 24.9946 14.343 24.9839 14.5124C26.4404 15.1465 27.4595 16.5798 27.4981 18.2645C27.5435 20.2736 25.9683 22 24 22Z"
                fill="#FFD043"
                stroke="#2B2825"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="logo-text">DAILY WANDER</span>
        </Link>

        <nav className="site-nav" aria-label="Main Navigation">
          <Link
            to="/wander"
            className={`nav-link ${location.pathname === '/wander' ? 'active' : ''}`}
          >
            Wander
          </Link>
          <Link
            to="/how-it-works"
            className={`nav-link ${location.pathname === '/how-it-works' ? 'active' : ''}`}
          >
            How it works
          </Link>
          <Link
            to="/share"
            className="btn btn-sun btn-sm"
          >
            Share your day
          </Link>
        </nav>
      </div>

      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(250, 247, 242, 0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(43, 40, 37, 0.07);
          padding: 14px 0;
        }

        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .site-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          transition: transform 0.2s ease;
        }

        .site-logo:hover {
          transform: scale(1.03);
        }

        .logo-cloud {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.25rem;
          letter-spacing: 0.04em;
          color: var(--ink-dark);
        }

        .site-nav {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-link {
          font-family: var(--font-heading);
          font-weight: 500;
          font-size: 1rem;
          color: var(--ink-medium);
          padding: 6px 12px;
          border-radius: var(--radius-full);
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          color: var(--ink-dark);
          background-color: rgba(43, 40, 37, 0.05);
        }

        .nav-link.active {
          color: var(--ink-dark);
          background-color: var(--sun-yellow-soft);
        }

        .btn-sm {
          padding: 8px 18px;
          font-size: 0.95rem;
        }

        @media (max-width: 640px) {
          .nav-link {
            font-size: 0.9rem;
            padding: 4px 8px;
          }
          .site-nav {
            gap: 8px;
          }
          .btn-sm {
            padding: 6px 12px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </header>
  );
}
