import React, { useState } from 'react';
import { resolveImageUrl, formatTimeAgo } from '../utils/image';

export default function WanderingCard({ post, style, tint = 'tint-sun', onSelect }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasPhoto = Boolean(post.hasPhoto || post.has_photo);
  const imagePath = post.imagePath || post.image_path;
  const username = post.username || 'Anonymous';
  const text = post.text;
  const createdAt = post.createdAt || post.created_at;
  const formattedTime = formatTimeAgo(createdAt);

  const fullImageUrl = hasPhoto && imagePath ? resolveImageUrl(imagePath) : null;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      onSelect(post);
    }
  };

  const cardAriaLabel = hasPhoto
    ? `Photo memory by ${username}${text ? `: ${text}` : ''}. Click to expand.`
    : `Text memory by ${username}: "${text || ''}". Click to expand.`;

  return (
    <div
      role="button"
      tabIndex={0}
      className="wandering-card-anchor"
      style={style}
      onClick={() => onSelect(post)}
      onKeyDown={handleKeyDown}
      aria-label={cardAriaLabel}
    >
      {hasPhoto ? (
        /* Photo Card */
        <article className="wandering-card wandering-photo-card">
          <div className="washi-tape-mini" aria-hidden="true" />

          <div className="wandering-photo-frame">
            {fullImageUrl && !imageError ? (
              <img
                src={fullImageUrl}
                alt={text || `Photo by ${username}`}
                className="wandering-photo"
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                style={{ opacity: imageLoaded ? 1 : 0.4 }}
              />
            ) : (
              <div className="wandering-photo-placeholder">
                <span>{imageError ? '☁️' : '☀️'}</span>
              </div>
            )}
          </div>

          <div className="wandering-card-meta">
            <span className="wandering-author">{username}</span>
            <span className="wandering-time">{formattedTime}</span>
          </div>

          {text && (
            <p className="wandering-caption-preview">
              {text}
            </p>
          )}
        </article>
      ) : (
        /* Text-Only Card */
        <article className={`wandering-card wandering-text-card ${tint}`}>
          <div className="wandering-quote-mark" aria-hidden="true">“</div>

          <p className="wandering-body-text">{text || 'A quiet moment recorded today.'}</p>

          <div className="wandering-text-footer">
            <span className="wandering-signature">— {username}</span>
            <span className="wandering-time">{formattedTime}</span>
          </div>
        </article>
      )}
    </div>
  );
}
