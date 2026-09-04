import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getTodayPosts } from '../api/client';
import { useThreeBirdsSession } from '../hooks/useThreeBirdsSession';
import ForestScene from '../components/ForestScene';
import RealisticBird from '../components/RealisticBird';
import PouchRevealModal from '../components/PouchRevealModal';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

export default function WanderingPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const isMountedRef = useRef(true);

  // Lock body/html scroll during the Wandering forest session
  useEffect(() => {
    document.documentElement.classList.add('wandering-active');
    document.body.classList.add('wandering-active');

    return () => {
      document.documentElement.classList.remove('wandering-active');
      document.body.classList.remove('wandering-active');
    };
  }, []);

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
          ? "The forest breeze got in the way. We couldn't reach today's memories."
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

  // Hook managing the 3 independent messenger birds across 3 trees
  const { birds, bouncingTrees } = useThreeBirdsSession(posts, Boolean(selectedPost));

  // Handler for opening a memory pouch
  const handleSelectPost = useCallback((post) => {
    setSelectedPost(post);
  }, []);

  // Handler for closing the revealed memory
  const handleCloseExpanded = useCallback(() => {
    setSelectedPost(null);
  }, []);

  return (
    <main className="forest-page wandering-page" aria-label="Wandering Forest Canvas">
      {/* Living Realistic Forest with Three Trees and Top-Only Clouds */}
      <ForestScene bouncingTrees={bouncingTrees}>
        {/* Forest Top Navigation Badge */}
        <header className="forest-top-nav wandering-top-nav" aria-label="Forest information">
          <div className="forest-header-badge wandering-header-badge">
            <div className="pill">
              <span>✦ today's forest</span>
            </div>
            {!loading && !error && posts.length > 0 && (
              <span className="forest-hint wandering-hint">
                {posts.length} {posts.length === 1 ? 'memory' : 'memories'} traveling through the trees
              </span>
            )}
          </div>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="container wandering-status-container">
            <LoadingState message="Listening to the forest breeze..." />
          </div>
        )}

        {/* Error State with clear Retry */}
        {error && !loading && (
          <div className="container wandering-status-container">
            <div className="error-state card-enter">
              <div className="error-icon" aria-hidden="true">🍃</div>
              <h2 className="error-title">The wind got in the way.</h2>
              <p className="error-message">{error}</p>
              <button onClick={fetchPosts} className="btn btn-primary btn-sm">
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Empty State: 0 memories today */}
        {!loading && !error && posts.length === 0 && (
          <>
            {/* Peaceful Birds Resting on Trees */}
            <RealisticBird birdIndex={0} flightPhase="perched" post={null} />
            <RealisticBird birdIndex={1} flightPhase="perched" post={null} />
            <div className="container wandering-status-container">
              <EmptyState />
            </div>
          </>
        )}

        {/* Interactive Three Messenger Birds & Hidden Memory Pouches */}
        {!loading && !error && posts.length > 0 && (
          <section
            className={`forest-canvas-container wandering-canvas-container ${selectedPost ? 'is-paused' : ''}`}
            aria-label="Interactive forest memories"
          >
            {birds.map(({ birdIndex, flightPhase, post }) => (
              <RealisticBird
                key={birdIndex}
                birdIndex={birdIndex}
                flightPhase={flightPhase}
                post={post}
                onSelectPouch={handleSelectPost}
              />
            ))}
          </section>
        )}
      </ForestScene>

      {/* Intimate Same-Screen Memory Reveal Modal (Opened on Pouch Click) */}
      {selectedPost && (
        <PouchRevealModal
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
          position: relative;
          z-index: 25;
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
          z-index: 30;
        }

        .error-icon {
          font-size: 2.8rem;
          margin-bottom: 12px;
        }

        .error-title {
          font-size: 1.6rem;
          color: var(--ink-dark);
          font-family: var(--font-heading);
          margin-bottom: 8px;
        }

        .error-message {
          color: var(--ink-medium);
          font-size: 0.98rem;
          margin-bottom: 24px;
          line-height: 1.5;
        }
      `}</style>
    </main>
  );
}
