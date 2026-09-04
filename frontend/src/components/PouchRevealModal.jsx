import React, { useEffect, useRef, useState } from 'react';
import { resolveImageUrl, formatTimeAgo } from '../utils/image';

/**
 * PouchRevealModal Component
 * The intimate memory reveal that gently opens when a user taps a bird's memory pouch.
 * 
 * Aesthetics:
 * - The physical memory pouch gently unties and reveals the precious memory within.
 * - The vintage physical photograph emerges in warm golden-hour light.
 * - Handwritten reflections appear as delicate handwritten ink notes.
 * - Same-screen interaction, fully keyboard accessible (Escape to close, auto-focused close button).
 */
export default function PouchRevealModal({ post, onClose }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const containerRef = useRef(null);
  const closeBtnRef = useRef(null);

  const hasPhoto = Boolean(post.hasPhoto || post.has_photo || post.imagePath || post.image_path);
  const imagePath = post.imagePath || post.image_path;
  const username = post.username || 'Anonymous';
  const text = post.text;
  const createdAt = post.createdAt || post.created_at;
  const formattedTime = formatTimeAgo(createdAt);
  const fullImageUrl = hasPhoto && imagePath ? resolveImageUrl(imagePath) : null;

  // Focus close button on mount & listen to Escape key
  useEffect(() => {
    if (closeBtnRef.current) {
      closeBtnRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.code === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle clicking on backdrop
  const handleBackdropClick = (e) => {
    if (e.target === containerRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={containerRef}
      className="pouch-reveal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Revealed memory carried by bird from ${username}`}
    >
      <div className="pouch-reveal-modal-wrapper">
        {/* Return / Close Button */}
        <button
          ref={closeBtnRef}
          type="button"
          className="pouch-reveal-close-btn"
          onClick={onClose}
          aria-label="Return to the forest"
        >
          <span className="close-icon" aria-hidden="true">✕</span>
          <span className="close-text">Return to the forest</span>
        </button>

        {/* The Opened Pouch & Revealed Memory */}
        <div className="pouch-reveal-assembly">
          {/* Opened Pouch Neck Graphic */}
          <div className="opened-pouch-neck" aria-hidden="true">
            <div className="unwrapped-twine" />
            <div className="pouch-open-lip" />
          </div>

          {hasPhoto ? (
            /* Revealed Physical Vintage Photograph */
            <article className="revealed-photo-memory">
              <div className="photo-paper-body">
                {/* Physical Print Viewport */}
                <div className="revealed-img-frame">
                  {fullImageUrl && !imageError ? (
                    <img
                      src={fullImageUrl}
                      alt={text || `Memory shared by ${username}`}
                      className="revealed-full-photo"
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageError(true)}
                      style={{ opacity: imageLoaded ? 1 : 0.6 }}
                    />
                  ) : (
                    <div className="revealed-img-placeholder">
                      <span>{imageError ? '📷 memory faded' : '✨ Gathering light...'}</span>
                    </div>
                  )}
                  {/* Warm Sunlight Glaze */}
                  <div className="revealed-photo-glaze" aria-hidden="true" />
                </div>

                {/* Handwritten Memory Annotation Associated with Photograph */}
                <div className="revealed-caption-area">
                  {text && (
                    <p className="revealed-handwritten-note">
                      {text}
                    </p>
                  )}

                  <div className="revealed-memory-byline">
                    <span className="revealed-author">— {username}</span>
                    <span className="revealed-dot">•</span>
                    <span className="revealed-time">{formattedTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ) : (
            /* Revealed Handwritten Letter / Note (Text-Only) */
            <article className="revealed-letter-memory">
              <div className="revealed-letter-paper">
                <div className="letter-crease-top" aria-hidden="true" />

                <div className="letter-text-body">
                  <p className="letter-handwritten-content">
                    {text || 'A quiet moment recorded today.'}
                  </p>
                </div>

                <div className="letter-signature-row">
                  <span className="letter-author">— {username}</span>
                  <span className="letter-time">{formattedTime}</span>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
