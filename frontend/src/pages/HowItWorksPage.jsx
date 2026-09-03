import React from 'react';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    num: '01',
    title: 'Share a moment',
    desc: 'Take a snapshot or pen a quiet thought from your day. Up to 100 photos join the collective daily gallery.',
    icon: '📸',
    color: 'var(--sun-yellow-soft)',
  },
  {
    num: '02',
    title: 'Someone wanders into it',
    desc: 'People wander across moments from around the world. No likes, no follower counts, just shared human time.',
    icon: '👣',
    color: 'var(--sky-blue-soft)',
  },
  {
    num: '03',
    title: 'Midnight comes',
    desc: 'When the clock strikes midnight in Asia/Kolkata, today closes its chapter.',
    icon: '🌙',
    color: 'var(--lavender-soft)',
  },
  {
    num: '04',
    title: 'It disappears',
    desc: 'Every photo and memory gently vanishes into thin air. Tomorrow starts fresh on a clean canvas.',
    icon: '✨',
    color: 'var(--peach-pink-soft)',
  },
];

export default function HowItWorksPage() {
  return (
    <main className="how-page">
      <div className="container">
        <header className="how-header">
          <span className="pill">☁️ philosophy</span>
          <h1 className="how-title">How Daily Wander Works</h1>
          <p className="how-subtitle">
            A temporary home for little moments. Born today, gone tomorrow.
          </p>
        </header>

        <section className="steps-grid" aria-label="How it works steps">
          {STEPS.map((step, idx) => (
            <div key={step.num} className="step-card card-enter" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="step-header">
                <span className="step-num">{step.num}</span>
                <span className="step-icon" style={{ backgroundColor: step.color }}>
                  {step.icon}
                </span>
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </section>

        <div className="how-cta">
          <Link to="/wander" className="btn btn-sun">
            Start Wandering &rarr;
          </Link>
        </div>
      </div>

      <style>{`
        .how-page {
          padding: 50px 0 100px 0;
        }

        .how-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 60px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .how-title {
          font-size: clamp(2.4rem, 5vw, 3.6rem);
          color: var(--ink-dark);
        }

        .how-subtitle {
          font-size: 1.15rem;
          color: var(--ink-medium);
          line-height: 1.6;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 28px;
          margin-bottom: 60px;
        }

        .step-card {
          background: var(--paper-white);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-polaroid);
          padding: 32px 24px;
          border: 1px solid rgba(43, 40, 37, 0.06);
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease;
        }

        .step-card:hover {
          transform: translateY(-6px);
        }

        .step-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .step-num {
          font-family: var(--font-handwritten);
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--ink-light);
        }

        .step-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
        }

        .step-title {
          font-size: 1.4rem;
          color: var(--ink-dark);
          margin-bottom: 10px;
        }

        .step-desc {
          font-size: 0.98rem;
          color: var(--ink-medium);
          line-height: 1.6;
        }

        .how-cta {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </main>
  );
}
