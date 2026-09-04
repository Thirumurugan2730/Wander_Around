import React, { useState } from 'react';
import { resolveImageUrl, formatTimeAgo } from '../utils/image';

export default function WanderingCard({ post, style, tint = 'cloud-tint-pure', depthClass = 'cloud-depth-mid', onSelect }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasPhoto = Boolean(post.hasPhoto || post.has_photo || post.imagePath || post.image_path);
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
    ? `Photo cloud memory by ${username}${text ? `: ${text}` : ''}. Click to open.`
    : `Text cloud memory by ${username}: "${text || ''}". Click to open.`;

  return (
    <div
      role="button"
      tabIndex={0}
      className={`wandering-cloud-anchor ${depthClass}`}
      style={style}
      onClick={() => onSelect(post)}
      onKeyDown={handleKeyDown}
      aria-label={cardAriaLabel}
    >
      {hasPhoto ? (
        /* Photo Cloud Moment */
        <article className={`cloud-card cloud-photo-card ${tint}`}>
          <div className="cloud-photo-frame">
            {fullImageUrl && !imageError ? (
              <img
                src={fullImageUrl}
                alt={text || `Photo by ${username}`}
                className="cloud-photo-img"
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                style={{ opacity: imageLoaded ? 1 : 0.4 }}
              />
            ) : (
              <div className="cloud-photo-placeholder">
                <span>{imageError ? '☁️' : '☀️'}</span>
              </div>
            )}
          </div>

          <div className="cloud-meta-row">
            <span className="cloud-author">{username}</span>
            <span className="cloud-time">{formattedTime}</span>
          </div>

          {text && (
            <p className="cloud-caption-preview">
              {text}
            </p>
          )}
        </article>
      ) : (
        /* Text-Only Cloud Moment */
        <article className={`cloud-card cloud-text-card ${tint}`}>
          <div className="cloud-quote-mark" aria-hidden="true">“</div>

          <p className="cloud-body-text">{text || 'A quiet thought drifting through the sky.'}</p>

          <div className="cloud-text-footer">
            <span className="cloud-signature">— {username}</span>
            <span className="cloud-time">{formattedTime}</span>
          </div>
        </article>
      )}
    </div>
  );
}
