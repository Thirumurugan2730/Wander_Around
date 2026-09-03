import React, { useState } from 'react';
import { resolveImageUrl, formatTimeAgo } from '../utils/image';

const TINT_CLASSES = ['tint-sun', 'tint-sky', 'tint-peach', 'tint-sage'];

export default function MomentCard({ post, index = 0, singleFocus = false }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Deterministic subtle tilt: between -1.5deg and +1.5deg
  const tilts = [-1.2, 1.0, -0.8, 1.4, -1.0, 0.7, -1.4, 1.2];
  const tilt = tilts[index % tilts.length];
  const tint = TINT_CLASSES[index % TINT_CLASSES.length];

  const hasPhoto = Boolean(post.hasPhoto || post.has_photo);
  const imagePath = post.imagePath || post.image_path;
  const username = post.username || 'Anonymous';
  const text = post.text;
  const createdAt = post.createdAt || post.created_at;
  const formattedTime = formatTimeAgo(createdAt);

  const fullImageUrl = hasPhoto && imagePath ? resolveImageUrl(imagePath) : null;

  return (
    <div
      className={`moment-card-wrapper card-enter ${singleFocus ? 'single-focus-wrapper' : ''}`}
      style={{ '--tilt': `${tilt}deg` }}
    >
      {hasPhoto ? (
        /* Photo Postcard */
        <article className="moment-card" aria-label={`Memory by ${username}`}>
          <div className="washi-tape" aria-hidden="true" />

          <div className="moment-photo-container">
            {fullImageUrl && !imageError ? (
              <img
                src={fullImageUrl}
                alt={text || `Photo shared by ${username}`}
                className="moment-photo"
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                style={{ opacity: imageLoaded ? 1 : 0.4 }}
              />
            ) : (
              <div className="photo-placeholder">
                <span>{imageError ? '☁️ photo faded' : 'Gathering light...'}</span>
              </div>
            )}
          </div>

          <div className="moment-meta">
            <span className="moment-author">{username}</span>
            <span className="moment-time">{formattedTime}</span>
          </div>

          {text && <p className="moment-caption">{text}</p>}
        </article>
      ) : (
        /* Text-Only Postcard */
        <article className={`moment-card moment-text-card ${tint}`} aria-label={`Moment by ${username}`}>
          <div className="moment-quote-mark" aria-hidden="true">“</div>
          
          <p className="moment-body-text">{text || 'A quiet moment recorded today.'}</p>

          <div className="moment-text-footer">
            <span className="moment-signature">— {username}</span>
            <span className="moment-time">{formattedTime}</span>
          </div>
        </article>
      )}

      <style>{`
        .photo-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F2ECE4;
          color: var(--ink-light);
          font-family: var(--font-handwritten);
          font-size: 1.25rem;
        }
      `}</style>
    </div>
  );
}
