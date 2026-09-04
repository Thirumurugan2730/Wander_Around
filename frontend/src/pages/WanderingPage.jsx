import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getTodayPosts } from '../api/client';
import { useWanderingLayout } from '../hooks/useWanderingLayout';
import WanderingCard from '../components/WanderingCard';
import ExpandedMoment from '../components/ExpandedMoment';
import WindLayer from '../components/WindLayer';
import NostalgicSun from '../components/NostalgicSun';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

export default function WanderingPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const isMountedRef = useRef(true);

  // Fetch today's posts from GET /api/posts/today
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTodayPosts();
      if (!isMountedRef.current) return;

      let normalized = [];
      if (Array.isArray(data)) {
        normalized = data;
      } else if (data && Array.isArray(data.posts)) {
        normalized = data.posts;
      } else if (data && Array.isArray(data.data)) {
        normalized = data.data;
      }

      setPosts(normalized);
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error('Failed to load today posts:', err);
      setError(
        err.message?.includes('HTTP error') || err.message?.includes('JSON')
          ? "The wind got in the way. We couldn't reach today's sky."
          : (err.message || "We couldn't find today's moments. Please try again.")
      );
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchPosts();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchPosts]);

  // Compute organic, stable positions, cloud silhouettes, compositions, and motion vectors
  const positionedCards = useWanderingLayout(posts);

  // Handler for opening a moment
  const handleSelectPost = useCallback((post) => {
    setSelectedPost(post);
  }, []);

  // Handler for closing the expanded moment
  const handleCloseExpanded = useCallback(() => {
    setSelectedPost(null);
  }, []);

  return (
    <main className="wandering-page" aria-label="Wandering Sky Canvas">
      {/* Nostalgic Golden Hour Sun & Solar Aura */}
      <NostalgicSun />

      {/* Ambient Distant Clouds */}
      <div className="ambient-sky-cloud ambient-cloud-1" aria-hidden="true" />
      <div className="ambient-sky-cloud ambient-cloud-2" aria-hidden="true" />
      <div className="ambient-sky-cloud ambient-cloud-3" aria-hidden="true" />

      {/* Visible Wind Trails, Breeze Ribbons & Floating Motes */}
      <WindLayer />

      {/* Atmospheric Sky Header */}
      <header className="wandering-top-nav" aria-label="Sky information">
        <div className="wandering-header-badge">
          <div className="pill">
            <span>✦ today's sky</span>
          </div>
          {!loading && !error && posts.length > 0 && (
            <span className="wandering-hint">
              {posts.length} {posts.length === 1 ? 'cloud' : 'clouds'} drifting through today
            </span>
          )}
        </div>
      </header>

      {/* Loading State: Only shown while actively pending */}
      {loading && (
        <div className="container wandering-status-container">
          <LoadingState message="Gathering today's drifting clouds..." />
        </div>
      )}

      {/* Error State with clear Retry */}
      {error && !loading && (
        <div className="container wandering-status-container">
          <div className="error-state card-enter">
            <div className="error-icon" aria-hidden="true">💨</div>
            <h2 className="error-title">The wind got in the way.</h2>
            <p className="error-message">{error}</p>
            <button onClick={fetchPosts} className="btn btn-primary btn-sm">
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Empty State: Only when posts are genuinely 0 and loading has finished */}
      {!loading && !error && posts.length === 0 && (
        <div className="container wandering-status-container">
          <EmptyState />
        </div>
      )}

      {/* Living Sky Canvas with all memories carried by wind */}
      {!loading && !error && posts.length > 0 && (
        <section
          className={`wandering-canvas-container ${selectedPost ? 'is-paused' : ''}`}
          aria-label="Interactive floating memories"
        >
          {positionedCards.map(({ post, style, cloudVariant, compositionType, depthClass, sunlitClass }, index) => {
            const postKey = post.id || `moment-${index}`;
            return (
              <WanderingCard
                key={postKey}
                post={post}
                style={style}
                cloudVariant={cloudVariant}
                compositionType={compositionType}
                depthClass={depthClass}
                sunlitClass={sunlitClass}
                onSelect={handleSelectPost}
              />
            );
          })}
        </section>
      )}

      {/* Same-Screen Expanded Modal Focus View */}
      {selectedPost && (
        <ExpandedMoment
          post={selectedPost}
          onClose={handleCloseExpanded}
        />
      )}

      <style>{`
        .wandering-status-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
        }

        .error-state {
          max-width: 460px;
          margin: 40px auto;
          padding: 40px 30px;
          background: var(--paper-white);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
          text-align: center;
          border: 1px solid rgba(43, 40, 37, 0.08);
          position: relative;
          z-index: 20;
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
          line-height: 1.5;
        }
      `}</style>
    </main>
  );
}
