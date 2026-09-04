import React from 'react';

/**
 * 4 distinct organic fluffy cloud silhouettes.
 * These create natural billowy cloud pillows with soft highlights and organic contours.
 */
export default function CloudSilhouette({ variant = 0, className = '', sunlitClass = 'sunlit-neutral' }) {
  const v = variant % 4;

  // Gradients dynamically tailored for sunlit warm vs neutral vs cool
  const isWarm = sunlitClass === 'sunlit-warm';
  const isCool = sunlitClass === 'sunlit-cool';

  const topColor = isWarm ? '#FFFDF5' : isCool ? '#F5F9FD' : '#FFFFFF';
  const midColor = isWarm ? '#FFF7EB' : isCool ? '#F0F5FA' : '#FAF7F2';
  const botColor = isWarm ? '#F4EAE0' : isCool ? '#E4ECF4' : '#E8EFF5';
  const rimHighlight = isWarm ? 'rgba(255, 238, 190, 0.65)' : 'rgba(255, 255, 255, 0.55)';

  if (v === 0) {
    // Wide fluffy billowy cumulus cloud
    return (
      <svg
        className={`cloud-svg-shape ${className}`}
        viewBox="0 0 340 190"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path
          d="M75 145 C45 145 20 125 20 95 C20 70 40 50 65 50 C75 25 105 10 140 10 C175 10 205 25 218 52 C232 42 255 42 270 56 C295 56 318 76 318 102 C318 130 295 148 268 148 C255 168 225 180 190 180 C155 180 125 168 105 152 Z"
          fill={`url(#cloudGrad0-${sunlitClass})`}
        />
        <path
          d="M85 55 C110 28 140 22 170 24 C150 32 135 48 130 65 C110 65 95 60 85 55 Z"
          fill={rimHighlight}
        />
        <defs>
          <linearGradient id={`cloudGrad0-${sunlitClass}`} x1="170" y1="10" x2="170" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={topColor} stopOpacity="0.98" />
            <stop offset="70%" stopColor={midColor} stopOpacity="0.94" />
            <stop offset="100%" stopColor={botColor} stopOpacity="0.88" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (v === 1) {
    // Soft rounded cloud pillow
    return (
      <svg
        className={`cloud-svg-shape ${className}`}
        viewBox="0 0 320 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path
          d="M60 140 C30 140 12 118 12 90 C12 62 34 45 60 45 C70 20 98 8 130 8 C168 8 198 25 208 50 C220 38 244 38 260 52 C285 52 305 72 305 98 C305 125 285 142 260 142 C248 162 218 174 185 174 C148 174 118 162 95 146 Z"
          fill={`url(#cloudGrad1-${sunlitClass})`}
        />
        <path
          d="M75 48 C95 24 125 18 155 20 C135 28 120 44 115 58 C98 58 85 52 75 48 Z"
          fill={rimHighlight}
        />
        <defs>
          <linearGradient id={`cloudGrad1-${sunlitClass}`} x1="160" y1="8" x2="160" y2="174" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={topColor} stopOpacity="0.98" />
            <stop offset="65%" stopColor={midColor} stopOpacity="0.95" />
            <stop offset="100%" stopColor={botColor} stopOpacity="0.86" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (v === 2) {
    // Asymmetrical billowing cloud bank
    return (
      <svg
        className={`cloud-svg-shape ${className}`}
        viewBox="0 0 350 195"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path
          d="M80 150 C48 150 20 128 20 98 C20 70 45 52 72 52 C84 24 116 8 155 8 C192 8 224 24 238 52 C255 40 282 42 298 58 C324 60 342 82 342 108 C342 135 320 154 290 154 C275 174 240 188 200 188 C160 188 126 174 102 156 Z"
          fill={`url(#cloudGrad2-${sunlitClass})`}
        />
        <path
          d="M92 56 C120 25 155 18 190 22 C168 30 150 48 144 64 C124 64 106 58 92 56 Z"
          fill={rimHighlight}
        />
        <defs>
          <linearGradient id={`cloudGrad2-${sunlitClass}`} x1="175" y1="8" x2="175" y2="188" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={topColor} stopOpacity="0.98" />
            <stop offset="70%" stopColor={midColor} stopOpacity="0.94" />
            <stop offset="100%" stopColor={botColor} stopOpacity="0.88" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Variant 3: Compact fluffy cloud
  return (
    <svg
      className={`cloud-svg-shape ${className}`}
      viewBox="0 0 310 175"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M65 135 C38 135 15 115 15 88 C15 62 36 46 62 46 C72 22 98 10 128 10 C162 10 190 26 202 50 C216 38 238 38 252 52 C275 52 294 70 294 95 C294 122 274 138 248 138 C236 158 206 168 175 168 C140 168 112 158 90 142 Z"
        fill={`url(#cloudGrad3-${sunlitClass})`}
      />
      <path
        d="M75 50 C98 26 128 20 156 22 C136 30 122 46 116 58 C98 58 86 52 75 50 Z"
        fill={rimHighlight}
      />
      <defs>
        <linearGradient id={`cloudGrad3-${sunlitClass}`} x1="155" y1="10" x2="155" y2="168" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={topColor} stopOpacity="0.98" />
          <stop offset="65%" stopColor={midColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor={botColor} stopOpacity="0.87" />
        </linearGradient>
      </defs>
    </svg>
  );
}
