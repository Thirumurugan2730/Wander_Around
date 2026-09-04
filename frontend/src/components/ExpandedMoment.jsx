import React, { useEffect, useRef, useState } from 'react';
import { resolveImageUrl, formatTimeAgo } from '../utils/image';

const TINT_CLASSES = ['tint-sun', 'tint-sky', 'tint-peach', 'tint-sage', 'tint-lavender'];

export default function ExpandedMoment({ post, index = 0, onClose }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const containerRef = useRef(null);
  const closeBtnRef = useRef(null);

  const hasPhoto = Boolean(post.hasPhoto || post.has_photo);
  const imagePath = post.imagePath || post.image_path;
  const username = post.username || 'Anonymous';
  const text = post.text;
  const createdAt = post.createdAt || post.created_at;
  const formattedTime = formatTimeAgo(createdAt);
  const fullImageUrl = hasPhoto && imagePath ? resolveImageUrl(imagePath) : null;

  const tint = TINT_CLASSES[index % TINT_CLASSES.length];

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
      className="expanded-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Expanded memory by ${username}`}
    >
      <div className="expanded-modal-wrapper">
        {/* Subtle Close Button */}
        <button
          ref={closeBtnRef}
          type="button"
          className="expanded-close-btn"
          onClick={onClose}
          aria-label="Return to wandering canvas"
        >
          <span className="close-icon" aria-hidden="true">✕</span>
          <span className="close-text">Return to canvas</span>
        </button>

        {hasPhoto ? (
          /* Expanded Photo + optional caption */
          <article className="expanded-card expanded-photo-card">
            <div className="washi-tape" aria-hidden="true" />

            <div className="expanded-photo-viewport">
              {fullImageUrl && !imageError ? (
                <img
                  src={fullImageUrl}
                  alt={text || `Photo shared by ${username}`}
                  className="expanded-full-photo"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  style={{ opacity: imageLoaded ? 1 : 0.6 }}
                />
              ) : (
                <div className="expanded-photo-placeholder">
                  <span>{imageError ? '☁️ photo faded' : 'Gathering light...'}</span>
                </div>
              )}
            </div>

            <div className="expanded-card-details">
              <div className="expanded-meta-bar">
                <span className="expanded-author">{username}</span>
                <span className="expanded-time">{formattedTime}</span>
              </div>

              {text && (
                <div className="expanded-caption-wrapper">
                  <p className="expanded-caption-text">{text}</p>
                </div>
              )}
            </div>
          </article>
        ) : (
          /* Expanded Text-only Moment */
          <article className={`expanded-card expanded-text-card ${tint}`}>
            <div className="expanded-quote-mark" aria-hidden="true">“</div>

            <div className="expanded-text-content">
              <p className="expanded-body-text">{text || 'A quiet moment recorded today.'}</p>
            </div>

            <div className="expanded-text-footer">
              <span className="expanded-signature">— {username}</span>
              <span className="expanded-time">{formattedTime}</span>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
