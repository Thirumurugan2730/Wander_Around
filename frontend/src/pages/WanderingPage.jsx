import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getTodayPosts } from '../api/client';
import { useWanderSession } from '../hooks/useWanderSession';
import MomentCard from '../components/MomentCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

export default function WanderingPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isTransitioningRef = useRef(false);
  const transitionTimeoutRef = useRef(null);
  const wanderBtnRef = useRef(null);

  // Fetch today's posts once on mount (or explicit refresh)
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTodayPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load today posts:', err);
      setError("The wind got in the way. We couldn't find today's moments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Initialize Wander session hook
  const { currentPost, currentIndex, totalPosts, cycleCount, wander } = useWanderSession(posts);

  // Maintain a stable ref to wander function to prevent stale closures in keyboard listener
  const wanderRef = useRef(wander);
  useEffect(() => {
    wanderRef.current = wander;
  }, [wander]);

  // Stable transition trigger
  const handleWander = useCallback(() => {
    if (isTransitioningRef.current) return;

    isTransitioningRef.current = true;
    setIsTransitioning(true);

    if (wanderRef.current) {
      wanderRef.current();
    }

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = setTimeout(() => {
      isTransitioningRef.current = false;
      setIsTransitioning(false);
    }, 220);
  }, []);

  // Permanent, stable keyboard listener on window
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      const tagName = target ? target.tagName : '';

      // Do NOT hijack typing inside text inputs, textareas, or contentEditable
      if (tagName === 'INPUT' || tagName === 'TEXTAREA' || (target && target.isContentEditable)) {
        return;
      }

      // Space key
      if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
        e.preventDefault(); // Prevent unwanted page scroll
        handleWander();
      }
      // Enter key
      else if (e.code === 'Enter' || e.key === 'Enter') {
        // If target is not already an interactive button or link, trigger wander
        if (tagName !== 'BUTTON' && tagName !== 'A') {
          handleWander();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [handleWander]);

  return (
    <main className="wandering-page">
      {/* Atmospheric Ambient Glows */}
      <div className="ambient-glow-sun" aria-hidden="true" />
      <div className="ambient-glow-sky" aria-hidden="true" />

      <div className="container wandering-container">
        {/* Wandering Atmospheric Header */}
        <header className="wandering-header">
          <div className="pill">
            <span>✦ today's wander</span>
          </div>

          <h1 className="wandering-title">
            Somewhere, today...
          </h1>

          <p className="wandering-subtitle">
            One quiet moment at a time. All memories fade away at midnight.
          </p>
        </header>

        {/* Loading State */}
        {loading && <LoadingState message="Finding today's little moments..." />}

        {/* Friendly Error State */}
        {error && !loading && (
          <div className="error-state card-enter">
            <div className="error-icon" aria-hidden="true">💨</div>
            <h2 className="error-title">The wind got in the way.</h2>
            <p className="error-message">{error}</p>
            <button onClick={fetchPosts} className="btn btn-primary btn-sm">
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && totalPosts === 0 && <EmptyState />}

        {/* Single-Focus Hero Moment View */}
        {!loading && !error && currentPost && (
          <section className="single-focus-section" aria-label="Current Moment">
            {/* The Current Postcard Hero */}
            <div
              key={`${currentPost.id}-${cycleCount}-${currentIndex}`}
              className={`moment-display-wrapper ${isTransitioning ? 'transition-out' : 'transition-in'}`}
            >
              <MomentCard
                post={currentPost}
                index={currentIndex}
                singleFocus={true}
              />
            </div>

            {/* Inviting Wander Controls */}
            <div className="wander-controls">
              <button
                ref={wanderBtnRef}
                type="button"
                className="btn btn-sun btn-wander"
                onClick={handleWander}
                onKeyDown={(e) => {
                  // Prevent native button click on Space to avoid double invocation with window listener
                  if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
                    e.preventDefault();
                  }
                }}
                disabled={isTransitioning}
                aria-label="Wander to the next moment"
              >
                Wander ✨
              </button>

              <div className="wander-meta">
                <span className="wander-progress">
                  Moment {currentIndex + 1} of {totalPosts}
                  {cycleCount > 1 && ` • Cycle ${cycleCount}`}
                </span>
                <span className="wander-keyboard-hint">
                  Press <kbd>Space</kbd> or click to wander
                </span>
              </div>

              <div className="wander-secondary-actions">
                <Link to="/share" className="btn-link-subtle">
                  Leave your own moment
                </Link>
                <span className="dot-sep">&bull;</span>
                <button
                  type="button"
                  className="btn-link-subtle"
                  onClick={fetchPosts}
                  title="Reload today's posts from server"
                >
                  Refresh feed
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      <style>{`
        .wandering-page {
          padding: 30px 0 80px 0;
          min-height: calc(85vh - 70px);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .wandering-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .wandering-header {
          text-align: center;
          max-width: 600px;
          margin-bottom: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .wandering-title {
          font-size: clamp(2.2rem, 4.8vw, 3.2rem);
          color: var(--ink-dark);
          line-height: 1.18;
          letter-spacing: -0.02em;
        }

        .wandering-subtitle {
          font-size: 1.05rem;
          color: var(--ink-medium);
          line-height: 1.5;
        }

        /* Single Focus Presentation */
        .single-focus-section {
          width: 100%;
          max-width: 520px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 auto;
        }

        .moment-display-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          transition: opacity 0.22s ease, transform 0.22s ease;
        }

        .transition-in {
          opacity: 1;
          transform: scale(1);
        }

        .transition-out {
          opacity: 0.65;
          transform: scale(0.98);
        }

        /* Wander Button & Controls */
        .wander-controls {
          margin-top: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        .btn-wander {
          font-size: 1.25rem;
          padding: 16px 46px;
          box-shadow: 4px 4px 0px var(--ink-dark);
        }

        .btn-wander:hover:not(:disabled) {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px var(--ink-dark);
        }

        .btn-wander:active:not(:disabled) {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px var(--ink-dark);
        }

        .wander-meta {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .wander-progress {
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--ink-medium);
        }

        .wander-keyboard-hint {
          font-family: var(--font-handwritten);
          font-size: 1.2rem;
          color: var(--ink-light);
        }

        kbd {
          background-color: var(--paper-white);
          border: 1px solid rgba(43, 40, 37, 0.2);
          border-radius: 4px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.08);
          font-family: monospace;
          font-size: 0.85em;
          padding: 2px 6px;
          color: var(--ink-dark);
        }

        .wander-secondary-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 6px;
        }

        .btn-link-subtle {
          background: none;
          border: none;
          color: var(--ink-light);
          font-family: var(--font-heading);
          font-size: 0.9rem;
          cursor: pointer;
          text-decoration: underline;
          padding: 4px;
          transition: color 0.2s ease;
        }

        .btn-link-subtle:hover {
          color: var(--ink-dark);
        }

        .dot-sep {
          color: var(--ink-faint);
        }

        /* Error state */
        .error-state {
          max-width: 460px;
          margin: 60px auto;
          padding: 40px 30px;
          background: var(--paper-white);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
          text-align: center;
          border: 1px solid rgba(43, 40, 37, 0.08);
        }

        .error-icon {
          font-size: 2.8rem;
          margin-bottom: 12px;
        }

        .error-title {
          font-size: 1.6rem;
          color: var(--ink-dark);
          margin-bottom: 8px;
        }

        .error-message {
          font-size: 1rem;
          color: var(--ink-medium);
          margin-bottom: 22px;
        }
      `}</style>
    </main>
  );
}
