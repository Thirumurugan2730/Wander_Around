import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getTodayPosts } from '../api/client';
import { useWanderingLayout } from '../hooks/useWanderingLayout';
import WanderingCard from '../components/WanderingCard';
import ExpandedMoment from '../components/ExpandedMoment';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

export default function WanderingPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  // Fetch today's posts once on mount (or on explicit retry/refresh)
  const fetchPosts = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Compute organic, stable positions and motion vectors for all posts
  const positionedCards = useWanderingLayout(posts);

  // Handler for opening a moment
  const handleSelectPost = useCallback((post) => {
    setSelectedPost(post);
  }, []);

  // Handler for closing the expanded moment
  const handleCloseExpanded = useCallback(() => {
    setSelectedPost(null);
  }, []);

  const selectedIndex = selectedPost
    ? posts.findIndex((p) => (p.id ? p.id === selectedPost.id : p === selectedPost))
    : 0;

  return (
    <main className="wandering-page" aria-label="Wandering Canvas">
      {/* Atmospheric Ambient Glows */}
      <div className="ambient-glow-sun" aria-hidden="true" />
      <div className="ambient-glow-sky" aria-hidden="true" />
      <div className="ambient-glow-lavender" aria-hidden="true" />

      {/* Minimal Top Navigation */}
      <nav className="wandering-top-nav" aria-label="Canvas actions">
        <div className="wandering-header-badge">
          <div className="pill">
            <span>✦ today's wander</span>
          </div>
          {!loading && !error && posts.length > 0 && (
            <span className="wandering-hint">
              {posts.length} {posts.length === 1 ? 'memory' : 'memories'} floating through today
            </span>
          )}
        </div>

        <div className="wandering-nav-actions">
          <Link to="/share" className="btn btn-sun btn-sm">
            Share your day
          </Link>
        </div>
      </nav>

      {/* Loading State */}
      {loading && (
        <div className="container">
          <LoadingState message="Finding today's little moments..." />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="container">
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

      {/* Empty State */}
      {!loading && !error && posts.length === 0 && (
        <div className="container">
          <EmptyState />
        </div>
      )}

      {/* Living Wandering Canvas with all moments */}
      {!loading && !error && posts.length > 0 && (
        <section
          className={`wandering-canvas-container ${selectedPost ? 'is-paused' : ''}`}
          aria-label="Interactive floating memories"
        >
          {positionedCards.map(({ post, style, tint }, index) => {
            const postKey = post.id || `moment-${index}`;
            return (
              <WanderingCard
                key={postKey}
                post={post}
                style={style}
                tint={tint}
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
          index={selectedIndex >= 0 ? selectedIndex : 0}
          onClose={handleCloseExpanded}
        />
      )}

      <style>{`
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
