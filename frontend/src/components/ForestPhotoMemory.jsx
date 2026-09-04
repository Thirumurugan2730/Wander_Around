import React, { useState } from 'react';
import { resolveImageUrl, formatTimeAgo } from '../utils/image';

/**
 * ForestPhotoMemory Component
 * Renders the physical printed vintage photograph carried by the messenger bird.
 * 
 * Aesthetics:
 * - Natural physical photograph with aged warm borders and soft vignette
 * - Slight natural tilt and gentle sway with the 5-second forest breeze
 * - Handwritten caption and byline etched directly in ink
 * - Accessible button interaction for opening the same-screen expanded modal
 */
export default function ForestPhotoMemory({
  post,
  onSelect,
  isPerched = true,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imagePath = post.imagePath || post.image_path;
  const username = post.username || 'Anonymous';
  const text = post.text;
  const createdAt = post.createdAt || post.created_at;
  const formattedTime = formatTimeAgo(createdAt);
  const fullImageUrl = imagePath ? resolveImageUrl(imagePath) : null;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      onSelect(post);
    }
  };

  const ariaLabel = `Photo memory carried by bird by ${username}${text ? `: ${text}` : ''}. Click to open.`;

  return (
    <div
      role="button"
      tabIndex={0}
      className={`forest-photo-print ${isPerched ? 'is-perched-print' : 'is-flying-print'}`}
      onClick={() => onSelect(post)}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
    >
      {/* Physical Photo Frame */}
      <article className="photo-paper-matte">
        {/* Soft Clip / Twig String Anchor where bird holds it */}
        <div className="photo-hanger-notch" aria-hidden="true">
          <div className="notch-twine" />
        </div>

        {/* The Image Viewport */}
        <div className="photo-image-frame">
          {fullImageUrl && !imageError ? (
            <img
              src={fullImageUrl}
              alt={text || `Photo shared by ${username}`}
              className="photo-vintage-img"
              loading="eager"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{ opacity: imageLoaded ? 1 : 0.4 }}
            />
          ) : (
            <div className="photo-placeholder">
              <span>{imageError ? '📷 photo faded' : '✨'}</span>
            </div>
          )}

          {/* Warm Golden Hour Vignette Glaze */}
          <div className="photo-sunlight-glaze" aria-hidden="true" />
        </div>

        {/* Handwritten Annotation & Author Stamp */}
        <div className="photo-caption-strip">
          {text && (
            <p className="photo-handwritten-caption">
              {text}
            </p>
          )}

          <div className="photo-byline">
            <span className="byline-author">{username}</span>
            <span className="byline-dot">•</span>
            <span className="byline-time">{formattedTime}</span>
          </div>
        </div>
      </article>
    </div>
  );
}
