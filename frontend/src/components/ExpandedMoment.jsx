import React, { useEffect, useRef, useState } from 'react';
import { resolveImageUrl, formatTimeAgo } from '../utils/image';

const CLOUD_TINTS = [
  'cloud-tint-pure',
  'cloud-tint-sun',
  'cloud-tint-sky',
  'cloud-tint-peach',
  'cloud-tint-lavender',
  'cloud-tint-mint',
];

export default function ExpandedMoment({ post, index = 0, onClose }) {
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

  const tint = CLOUD_TINTS[index % CLOUD_TINTS.length];

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
        {/* Return to Sky Close Button */}
        <button
          ref={closeBtnRef}
          type="button"
          className="expanded-close-btn"
          onClick={onClose}
          aria-label="Return to the sky"
        >
          <span className="close-icon" aria-hidden="true">✕</span>
          <span className="close-text">Return to the sky</span>
        </button>

        {hasPhoto ? (
          /* Expanded Photo Cloud Focus */
          <article className={`expanded-cloud-frame expanded-photo-view ${tint}`}>
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
                <div className="cloud-photo-placeholder">
                  <span>{imageError ? '☁️ photo faded' : 'Gathering light...'}</span>
                </div>
              )}
            </div>

            <div className="expanded-details-bar">
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
          /* Expanded Text Cloud Focus */
          <article className={`expanded-cloud-frame expanded-text-view ${tint}`}>
            <div className="expanded-quote-mark" aria-hidden="true">“</div>

            <div className="expanded-text-content">
              <p className="expanded-body-text">{text || 'A quiet thought recorded today.'}</p>
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
