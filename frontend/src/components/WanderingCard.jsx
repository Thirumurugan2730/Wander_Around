import React, { useState } from 'react';
import { resolveImageUrl, formatTimeAgo } from '../utils/image';
import CloudSilhouette from './CloudSilhouette';

export default function WanderingCard({
  post,
  style,
  cloudVariant = 0,
  compositionType = 'photo-rest',
  depthClass = 'depth-mid',
  sunlitClass = 'sunlit-neutral',
  motionState = 'floating',
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
      className={`memory-cloud-anchor ${depthClass} ${sunlitClass} motion-${motionState} comp-${compositionType}`}
      style={style}
      onClick={() => onSelect(post)}
      onKeyDown={handleKeyDown}
      aria-label={cardAriaLabel}
    >
      {/* Real Organic Fluffy Cloud Silhouette */}
      <div className="cloud-backdrop-wrapper">
        <CloudSilhouette variant={cloudVariant} sunlitClass={sunlitClass} className="cloud-silhouette-svg" />
      </div>

      {hasPhoto ? (
        /* Photograph Memory Carried by Cloud */
        <article className="photo-memory-item">
          <div className="photo-print-frame">
            <div className="washi-tape-photo" aria-hidden="true" />

            <div className="photo-image-wrapper">
              {fullImageUrl && !imageError ? (
                <img
                  src={fullImageUrl}
                  alt={text || `Memory by ${username}`}
                  className="photo-print-img"
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  style={{ opacity: imageLoaded ? 1 : 0.4 }}
                />
              ) : (
                <div className="photo-placeholder-box">
                  <span>{imageError ? '☁️' : '☀️'}</span>
                </div>
              )}
            </div>

            {/* Quiet Photo Caption Margin */}
            <div className="photo-bottom-margin">
              <span className="photo-handwritten-author">{username}</span>
              <span className="photo-handwritten-time">{formattedTime}</span>
            </div>
          </div>

          {/* Attached Handwritten Note for Photo + Text */}
          {text && compositionType === 'photo-text-combo' && (
            <div className="attached-note-scrap">
              <div className="mini-pin-tape" aria-hidden="true" />
              <p className="attached-note-text">{text}</p>
            </div>
          )}

          {text && compositionType !== 'photo-text-combo' && (
            <p className="photo-inline-caption">{text}</p>
          )}
        </article>
      ) : (
        /* Handwritten Paper Note Carried by Cloud */
        <article className="text-note-memory-item">
          <div className="paper-note-scrap">
            <div className="note-washi-tape" aria-hidden="true" />
            <div className="note-quote-mark" aria-hidden="true">“</div>

            <p className="note-handwritten-body">
              {text || 'A quiet thought recorded today.'}
            </p>

            <div className="note-signature-row">
              <span className="note-signature">— {username}</span>
              <span className="note-timestamp">{formattedTime}</span>
            </div>
          </div>
        </article>
      )}
    </div>
  );
}
