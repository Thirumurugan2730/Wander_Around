import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main className="landing-page">
      {/* Atmospheric Ambient Glows */}
      <div className="ambient-glow-sun" aria-hidden="true" />
      <div className="ambient-glow-sky" aria-hidden="true" />
      <div className="ambient-glow-lavender" aria-hidden="true" />

      <div className="container">
        <section className="landing-hero">
          {/* Main Content Column */}
          <div className="hero-text-col">
            <div className="pill anim-fade-up">
              <span>✦ Daily Wander</span>
            </div>

            <h1 className="hero-title anim-fade-up anim-delay-1">
              A thousand little moments. <br />
              <span className="hero-highlight">One day</span> to see them.
            </h1>

            <div className="hero-manifesto anim-fade-up anim-delay-2">
              <p className="manifesto-lead">Every day is filled with little moments.</p>
              <p className="manifesto-sub">
                Some are beautiful. Some are ordinary. <br />
                Some mean nothing to anyone else.
              </p>
              <p className="manifesto-today">
                But today, they're here.
              </p>
            </div>

            <p className="hero-subtext anim-fade-up anim-delay-2">
              Wander through moments shared by people around the world.
              <br />
              Tomorrow, they're gone.
            </p>

            <div className="hero-actions anim-fade-up anim-delay-3">
              <Link to="/wander" className="btn btn-sun">
                Start Wandering &rarr;
              </Link>
              <Link to="/share" className="btn btn-secondary">
                Share your day
              </Link>
            </div>
          </div>

          {/* Floating Memory Cards Collage */}
          <div className="hero-visual-col" aria-hidden="true">
            <div className="floating-card card-one float-slow">
              <div className="washi-tape" />
              <div className="card-mock-img img-warm">
                <span>☕ morning coffee & warm sun</span>
              </div>
              <div className="card-mock-footer">
                <span className="card-mock-author">Elena</span>
                <span className="handwritten">08:14 am</span>
              </div>
            </div>

            <div className="floating-card card-two float-delayed">
              <div className="card-mock-text">
                <span className="quote-mark">“</span>
                <p>The rain finally stopped right as the sun set behind the eucalyptus trees.</p>
                <div className="card-mock-footer text-footer">
                  <span className="handwritten">— Anonymous</span>
                  <span className="handwritten">06:45 pm</span>
                </div>
              </div>
            </div>

            <div className="floating-card card-three float-slow">
              <div className="card-mock-img img-sky">
                <span>🌊 cool breeze at the dock</span>
              </div>
              <div className="card-mock-footer">
                <span className="card-mock-author">Kaito</span>
                <span className="handwritten">03:22 pm</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .landing-page {
          padding: 60px 0 100px 0;
          overflow: hidden;
          position: relative;
        }

        .landing-hero {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 60px;
          align-items: center;
          min-height: calc(80vh - 80px);
        }

        .hero-text-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
        }

        .hero-title {
          font-size: clamp(3rem, 6.2vw, 4.8rem);
          line-height: 1.08;
          letter-spacing: -0.025em;
          color: var(--ink-dark);
          margin-top: 6px;
        }

        .hero-highlight {
          position: relative;
          display: inline-block;
          color: var(--coral-accent);
        }

        .hero-highlight::after {
          content: '';
          position: absolute;
          bottom: 6px;
          left: -4px;
          right: -4px;
          height: 16px;
          background-color: var(--sun-butter);
          z-index: -1;
          border-radius: 6px;
          transform: rotate(-1.5deg);
        }

        .hero-manifesto {
          background: rgba(255, 255, 255, 0.7);
          border-left: 4px solid var(--sun-yellow);
          padding: 18px 22px;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          margin: 6px 0;
          box-shadow: 0 4px 14px rgba(43, 40, 37, 0.04);
        }

        .manifesto-lead {
          font-weight: 600;
          font-size: 1.15rem;
          color: var(--ink-dark);
        }

        .manifesto-sub {
          font-size: 1rem;
          color: var(--ink-medium);
          margin-top: 4px;
        }

        .manifesto-today {
          font-family: var(--font-handwritten);
          font-size: 1.55rem;
          color: var(--ink-dark);
          margin-top: 6px;
        }

        .hero-subtext {
          font-size: 1.15rem;
          line-height: 1.6;
          color: var(--ink-medium);
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 10px;
          flex-wrap: wrap;
        }

        /* Floating Cards Collage */
        .hero-visual-col {
          position: relative;
          height: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .floating-card {
          position: absolute;
          background: var(--paper-white);
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-polaroid);
          border: 1px solid rgba(43, 40, 37, 0.08);
          padding: 14px 14px 18px 14px;
          transition: transform 0.3s ease;
        }

        .floating-card:hover {
          z-index: 10;
        }

        .card-one {
          top: 30px;
          left: 30px;
          width: 250px;
          --base-rot: -4deg;
          transform: rotate(-4deg);
          z-index: 2;
        }

        .card-two {
          bottom: 30px;
          left: 10px;
          width: 280px;
          background: #FFFDF4;
          border-top: 4px solid var(--sun-yellow);
          --base-rot: 3deg;
          transform: rotate(3deg);
          z-index: 3;
        }

        .card-three {
          top: 130px;
          right: 20px;
          width: 260px;
          --base-rot: 6deg;
          transform: rotate(6deg);
          z-index: 1;
        }

        .card-mock-img {
          width: 100%;
          height: 150px;
          border-radius: 6px;
          display: flex;
          align-items: flex-end;
          padding: 10px;
          font-family: var(--font-handwritten);
          font-size: 1.1rem;
          color: var(--ink-dark);
        }

        .img-warm {
          background: linear-gradient(135deg, #FFE8B6 0%, #FFD6A5 100%);
        }

        .img-sky {
          background: linear-gradient(135deg, #C5E3F6 0%, #A2D2FF 100%);
        }

        .card-mock-footer {
          margin-top: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .card-mock-author {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .card-mock-text {
          padding: 10px 6px;
        }

        .quote-mark {
          font-size: 2.2rem;
          line-height: 0.6;
          color: var(--ink-faint);
          display: block;
          margin-bottom: 6px;
        }

        .card-mock-text p {
          font-size: 0.95rem;
          color: var(--ink-dark);
          line-height: 1.5;
        }

        .text-footer {
          margin-top: 12px;
          padding-top: 8px;
          border-top: 1px dashed rgba(43, 40, 37, 0.15);
        }

        @media (max-width: 960px) {
          .landing-hero {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .hero-visual-col {
            height: 400px;
            width: 100%;
          }
          .card-one { left: 8%; width: 220px; }
          .card-two { left: 4%; width: 240px; }
          .card-three { right: 8%; width: 220px; }
        }
      `}</style>
    </main>
  );
}
