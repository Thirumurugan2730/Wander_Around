import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getTodayPosts } from '../api/client';
import { useForestSession } from '../hooks/useForestSession';
import ForestScene from '../components/ForestScene';
import MemoryBird from '../components/MemoryBird';
import ForestPhotoMemory from '../components/ForestPhotoMemory';
import DriftingTextNote from '../components/DriftingTextNote';
import ExpandedMoment from '../components/ExpandedMoment';
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

  // Hook driving bird carrier flight loop and drifting notes
  const {
    photoPosts,
    currentPhotoPost,
    flightPhase,
    isBranchBouncing,
    textNoteItems,
  } = useForestSession(posts, Boolean(selectedPost));

  // Handler for opening a moment
  const handleSelectPost = useCallback((post) => {
    setSelectedPost(post);
  }, []);

  // Handler for closing the expanded moment
  const handleCloseExpanded = useCallback(() => {
    setSelectedPost(null);
  }, []);

  return (
    <main className="forest-page wandering-page" aria-label="Wandering Forest Canvas">
      {/* Living Nostalgic Forest Environment */}
      <ForestScene isBranchBouncing={isBranchBouncing}>
        {/* Top Navigation Badge */}
        <header className="forest-top-nav wandering-top-nav" aria-label="Forest information">
          <div className="forest-header-badge wandering-header-badge">
            <div className="pill">
              <span>✦ today's forest</span>
            </div>
            {!loading && !error && posts.length > 0 && (
              <span className="forest-hint wandering-hint">
                {posts.length} {posts.length === 1 ? 'memory' : 'memories'} living in today's breeze
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

        {/* Empty State: Only when posts are genuinely 0 and loading has finished */}
        {!loading && !error && posts.length === 0 && (
          <>
            {/* Peaceful Resting Bird in Empty Forest */}
            <MemoryBird flightPhase="perched" hasPhoto={false} />
            <div className="container wandering-status-container">
              <EmptyState />
            </div>
          </>
        )}

        {/* Living Forest Memories when posts exist */}
        {!loading && !error && posts.length > 0 && (
          <section
            className={`forest-canvas-container wandering-canvas-container ${selectedPost ? 'is-paused' : ''}`}
            aria-label="Interactive forest memories"
          >
            {/* 1. Messenger Bird carrying and perching with Photo Memories */}
            {photoPosts.length > 0 && (
              <MemoryBird flightPhase={flightPhase} hasPhoto={Boolean(currentPhotoPost)}>
                {currentPhotoPost && (
                  <ForestPhotoMemory
                    post={currentPhotoPost}
                    onSelect={handleSelectPost}
                    isPerched={flightPhase === 'perched'}
                  />
                )}
              </MemoryBird>
            )}

            {/* If no photo posts exist, bird perches peacefully in the background */}
            {photoPosts.length === 0 && (
              <MemoryBird flightPhase="perched" hasPhoto={false} />
            )}

            {/* 2. Handwritten Text Memories Drifting on Forest Breeze */}
            {textNoteItems.map(({ post, altitudeClass, style }, index) => {
              const postKey = post.id || `text-note-${index}`;
              return (
                <DriftingTextNote
                  key={postKey}
                  post={post}
                  altitudeClass={altitudeClass}
                  style={style}
                  onSelect={handleSelectPost}
                />
              );
            })}
          </section>
        )}
      </ForestScene>

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
