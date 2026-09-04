import React, { useState } from 'react';
import { resolveImageUrl, formatTimeAgo } from '../utils/image';
import CloudSilhouette from './CloudSilhouette';

export default function WanderingCard({
  post,
  laneClass = 'lane-0',
  style,
  cloudVariant = 0,
  compositionType = 'photo-rest',
  depthClass = 'depth-mid',
  sunlitClass = 'sunlit-neutral',
  onSelect,
}) {
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
    ? `Photo memory drifting in cloud by ${username}${text ? `: ${text}` : ''}. Click to open.`
    : `Handwritten memory drifting in cloud by ${username}: "${text || ''}". Click to open.`;

  return (
    <div
      role="button"
      tabIndex={0}
      className={`memory-cloud-anchor ${laneClass} ${depthClass} ${sunlitClass} comp-${compositionType}`}
      style={style}
      onClick={() => onSelect(post)}
      onKeyDown={handleKeyDown}
      aria-label={cardAriaLabel}
    >
      {/* 1. Cloud Background Cumulus Body */}
      <div className="cloud-backdrop-wrapper">
        <CloudSilhouette
          variant={cloudVariant}
          layer="back"
          sunlitClass={sunlitClass}
          className="cloud-silhouette-svg"
        />
      </div>

      {/* 2. Memory Integrated Directly Inside the Cloud (NO RECTANGULAR CARDS, NO BORDERS, NO SEPARATE CONTAINERS) */}
      <article className="cloud-memory-article">
        {hasPhoto ? (
          <div className="cloud-photo-ensemble">
            {/* The photo gently emerges from the cloud with soft feathered edges */}
            <div className="cloud-photo-wrapper">
              {fullImageUrl && !imageError ? (
                <img
                  src={fullImageUrl}
                  alt={text || `Memory by ${username}`}
                  className="cloud-embedded-photo"
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

            {/* If post includes handwritten thoughts, it flows below in natural ink */}
            {text && (
              <p className="cloud-photo-caption">
                {text}
              </p>
            )}

            {/* Soft handwritten author & time etched directly into the cloud atmosphere */}
            <div className="cloud-memory-byline">
              <span className="cloud-byline-author">{username}</span>
              <span className="cloud-byline-dot">•</span>
              <span className="cloud-byline-time">{formattedTime}</span>
            </div>
          </div>
        ) : (
          <div className="cloud-text-ensemble">
            {/* Handwritten thought floating directly in the billowy cloud */}
            <p className="cloud-handwritten-thought">
              {text || 'A quiet thought recorded today.'}
            </p>

            {/* Author and timestamp signature written into the sky */}
            <div className="cloud-memory-byline">
              <span className="cloud-byline-author">— {username}</span>
              <span className="cloud-byline-dot">•</span>
              <span className="cloud-byline-time">{formattedTime}</span>
            </div>
          </div>
        )}
      </article>

      {/* 3. Cloud Foreground Wisps Layer (laps over bottom/edges so memory is nestled inside) */}
      <div className="cloud-foreground-wrapper">
        <CloudSilhouette
          variant={cloudVariant}
          layer="front"
          sunlitClass={sunlitClass}
          className="cloud-foreground-svg"
        />
      </div>
    </div>
  );
}
