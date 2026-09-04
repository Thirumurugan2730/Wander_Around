import React from 'react';

/**
 * MemoryPouch Component
 * A tiny, handmade physical memory pouch / weathered linen satchel carried by a bird.
 * 
 * CORE CONSTRAINT:
 * The actual user photograph or story is NEVER visible during flight or perching.
 * Only the small physical pouch is visible until the user taps/clicks it to reveal the memory.
 * 
 * Features:
 * - Realistic weathered cloth / folded paper packet with tied twine string
 * - Subtle physical pendulum swing physics in breeze and flight
 * - Large accessible touch/tap target (>= 44x44px)
 * - Clear focus state for keyboard navigation (Enter / Space)
 */
export default function MemoryPouch({
  post,
  onSelect,
  isFlying = false,
  isPerched = true,
  pouchVariant = 0, // 0: weathered linen satchel, 1: folded parchment packet, 2: soft leather pouch
}) {
  const username = post.username || 'Anonymous';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      onSelect(post);
    }
  };

  const ariaLabel = `Memory pouch carried by bird by ${username}. Tap to reveal hidden memory.`;

  return (
    <div
      role="button"
      tabIndex={0}
      className={`memory-pouch-anchor ${isFlying ? 'is-flying-pouch' : 'is-settled-pouch'} pouch-var-${pouchVariant}`}
      onClick={() => onSelect(post)}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      title="Tap to reveal memory"
    >
      {/* 1. Delicate Twine Thread Suspended from Bird Beak / Claws */}
      <div className="pouch-twine-thread" aria-hidden="true" />

      {/* 2. Physical Handmade Pouch Silhouette */}
      <div className="pouch-body-wrapper">
        <svg
          className="pouch-svg"
          viewBox="0 0 48 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Weathered Linen Satchel Gradient */}
            <linearGradient id="pouchLinenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EADECC" />
              <stop offset="50%" stopColor="#D5C5AE" />
              <stop offset="100%" stopColor="#B39F85" />
            </linearGradient>

            {/* Folded Parchment Packet Gradient */}
            <linearGradient id="pouchParchmentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2D6" />
              <stop offset="60%" stopColor="#F0DCB4" />
              <stop offset="100%" stopColor="#D2B989" />
            </linearGradient>

            {/* Weathered Leather Satchel Gradient */}
            <linearGradient id="pouchLeatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A87A51" />
              <stop offset="60%" stopColor="#875B35" />
              <stop offset="100%" stopColor="#5E3C1E" />
            </linearGradient>

            {/* Twine Knot Color */}
            <linearGradient id="twineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D4A76A" />
              <stop offset="100%" stopColor="#8C6230" />
            </linearGradient>
          </defs>

          {/* Twine Tie String at Top */}
          <path
            d="M24 0 L24 10"
            stroke="url(#twineGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Tied Knot & Bow */}
          <ellipse cx="24" cy="11" rx="5" ry="2.5" fill="url(#twineGrad)" />
          <path
            d="M21 11 C 17 8, 14 13, 19 14 M27 11 C 31 8, 34 13, 29 14"
            stroke="url(#twineGrad)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Pouch Main Bag Body */}
          {pouchVariant === 0 && (
            /* Weathered Linen Satchel with cinched neck and rounded bottom */
            <g className="pouch-shape-linen">
              <path
                d="M20 12 C 16 14, 10 20, 8 32 C 6 42, 14 50, 24 50 C 34 50, 42 42, 40 32 C 38 20, 32 14, 28 12 Z"
                fill="url(#pouchLinenGrad)"
              />
              {/* Subtle Fabric Fold Creases */}
              <path
                d="M16 22 C 20 28, 22 40, 20 46 M32 22 C 28 28, 26 40, 28 46"
                stroke="#9E8A72"
                strokeWidth="0.8"
                opacity="0.4"
                strokeLinecap="round"
              />
            </g>
          )}

          {pouchVariant === 1 && (
            /* Folded Parchment Packet with wax seal dot */
            <g className="pouch-shape-parchment">
              <path
                d="M10 14 L38 14 C 40 14, 42 16, 41 20 L38 46 C 37 49, 35 50, 32 50 L16 50 C 13 50, 11 49, 10 46 L7 20 C 6 16, 8 14, 10 14 Z"
                fill="url(#pouchParchmentGrad)"
              />
              {/* Envelope Flap Crease */}
              <path
                d="M8 17 L24 30 L40 17"
                stroke="#B89B6A"
                strokeWidth="1"
                fill="none"
              />
              {/* Tiny Wax Seal / Stamp */}
              <circle cx="24" cy="31" r="3.2" fill="#B34A38" opacity="0.85" />
            </g>
          )}

          {pouchVariant === 2 && (
            /* Weathered Leather Pouch */
            <g className="pouch-shape-leather">
              <path
                d="M19 12 C 14 15, 9 22, 9 34 C 9 44, 15 50, 24 50 C 33 50, 39 44, 39 34 C 39 22, 34 15, 29 12 Z"
                fill="url(#pouchLeatherGrad)"
              />
              {/* Leather Stitching Details */}
              <path
                d="M12 30 C 12 40, 16 46, 24 46 C 32 46, 36 40, 36 30"
                stroke="#422710"
                strokeWidth="0.8"
                strokeDasharray="2 2"
                fill="none"
                opacity="0.6"
              />
            </g>
          )}
        </svg>

        {/* Subtle Interactive Aura / Glow on Hover/Focus */}
        <div className="pouch-interactive-aura" aria-hidden="true" />
      </div>

      {/* Touch Target Expander for Mobile Ergonomics (>= 44px) */}
      <div className="pouch-touch-target" aria-hidden="true" />
    </div>
  );
}
