import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import WanderingPage from './pages/WanderingPage';
import ShareDayPage from './pages/ShareDayPage';
import HowItWorksPage from './pages/HowItWorksPage';

export default function App() {
  return (
    <Router>
      <div className="app-shell">
        <Header />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/wander" element={<WanderingPage />} />
            <Route path="/share" element={<ShareDayPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
          </Routes>
        </div>
        <footer className="app-footer">
          <div className="container footer-inner">
            <p className="footer-line">
              ☁️ <strong>Daily Wander</strong> &bull; A sanctuary for little moments.
            </p>
            <p className="footer-sub">
              Everything shared today fades at midnight.
            </p>
          </div>
        </footer>
      </div>

      <style>{`
        .app-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .app-content {
          flex: 1;
        }

        .app-footer {
          border-top: 1px solid rgba(43, 40, 37, 0.07);
          padding: 30px 0;
          background: rgba(250, 247, 242, 0.6);
          margin-top: auto;
        }

        .footer-inner {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .footer-line {
          font-family: var(--font-heading);
          font-size: 0.95rem;
          color: var(--ink-dark);
        }

        .footer-sub {
          font-family: var(--font-handwritten);
          font-size: 1.25rem;
          color: var(--ink-light);
        }
      `}</style>
    </Router>
  );
}
