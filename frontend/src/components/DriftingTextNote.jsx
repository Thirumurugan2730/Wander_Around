import React from 'react';
import { formatTimeAgo } from '../utils/image';

/**
 * DriftingTextNote Component
 * Renders a handwritten text-only memory drifting gently through the forest breeze.
 * 
 * Aesthetics:
 * - Organic parchment leaf / atmospheric breeze fragment
 * - Handwritten ink script (Caveat) etched directly into the air
 * - Gentle Left → Right flight path along natural altitude currents
 * - Accessible button interaction for opening the same-screen expanded modal
 */
export default function DriftingTextNote({
  post,
  onSelect,
  style,
  altitudeClass = 'alt-mid',
}) {
  const username = post.username || 'Anonymous';
  const text = post.text || 'A quiet thought recorded today.';
  const createdAt = post.createdAt || post.created_at;
  const formattedTime = formatTimeAgo(createdAt);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      onSelect(post);
    }
  };

  const ariaLabel = `Handwritten memory drifting through forest by ${username}: "${text}". Click to open.`;

  return (
    <div
      role="button"
      tabIndex={0}
      className={`drifting-text-leaf ${altitudeClass}`}
      style={style}
      onClick={() => onSelect(post)}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
    >
      <article className="text-leaf-content">
        {/* Soft Organic Leaf / Parchment Background SVG */}
        <div className="text-leaf-silhouette" aria-hidden="true">
          <svg viewBox="0 0 240 140" fill="none" preserveAspectRatio="none">
            <path
              d="M10 70 C 20 20, 100 5, 200 25 C 235 35, 240 70, 220 105 C 190 140, 80 145, 25 120 C 12 105, 5 90, 10 70 Z"
              fill="url(#leafParchmentGrad)"
              filter="url(#leafSoftShadow)"
            />
            <defs>
              <linearGradient id="leafParchmentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF8E7" stopOpacity="0.88" />
                <stop offset="60%" stopColor="#F9EED4" stopOpacity="0.82" />
                <stop offset="100%" stopColor="#EEDBBA" stopOpacity="0.75" />
              </linearGradient>
              <filter id="leafSoftShadow" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3B2E1E" floodOpacity="0.12" />
              </filter>
            </defs>
          </svg>
        </div>

        {/* Handwritten Thought Body */}
        <p className="drifting-thought-text">
          {text}
        </p>

        {/* Handwritten Signature & Timestamp */}
        <div className="drifting-thought-byline">
          <span className="byline-author">— {username}</span>
          <span className="byline-dot">•</span>
          <span className="byline-time">{formattedTime}</span>
        </div>
      </article>
    </div>
  );
}
