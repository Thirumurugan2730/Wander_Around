import React from 'react';

/**
 * CloudSilhouette
 * 4 distinct organic fluffy cloud silhouettes with dual-layer capability:
 * - layer="back": Full billowy background cumulus cloud body + sunlit top highlights
 * - layer="front": Soft foreground cloud wisps and billows that curl over the bottom edge of the memory
 * - layer="all": Full composition
 */
export default function CloudSilhouette({
  variant = 0,
  layer = 'back',
  className = '',
  sunlitClass = 'sunlit-neutral',
}) {
  const v = variant % 4;

  const isWarm = sunlitClass === 'sunlit-warm';
  const isCool = sunlitClass === 'sunlit-cool';

  const topColor = isWarm ? '#FFFDF7' : isCool ? '#F6FAFD' : '#FFFFFF';
  const midColor = isWarm ? '#FFF6E9' : isCool ? '#F0F5FA' : '#FAF8F4';
  const botColor = isWarm ? '#F5EAE0' : isCool ? '#E4ECF4' : '#EAEFF5';
  const rimHighlight = isWarm ? 'rgba(255, 238, 190, 0.7)' : 'rgba(255, 255, 255, 0.6)';

  // Gradient for foreground cloud wisps
  const frontTop = isWarm ? 'rgba(255, 250, 240, 0.96)' : isCool ? 'rgba(246, 250, 254, 0.96)' : 'rgba(255, 255, 255, 0.96)';
  const frontBot = isWarm ? '#F4E7DB' : isCool ? '#E2EBF3' : '#E8EFF5';

  if (v === 0) {
    // Wide fluffy billowy cumulus cloud (340 x 190)
    return (
      <svg
        className={`cloud-svg-shape ${className}`}
        viewBox="0 0 340 190"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`cloudGrad0-back-${sunlitClass}`} x1="170" y1="10" x2="170" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={topColor} stopOpacity="0.98" />
            <stop offset="70%" stopColor={midColor} stopOpacity="0.95" />
            <stop offset="100%" stopColor={botColor} stopOpacity="0.88" />
          </linearGradient>
          <linearGradient id={`cloudGrad0-front-${sunlitClass}`} x1="170" y1="125" x2="170" y2="188" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={frontTop} stopOpacity="0.96" />
            <stop offset="100%" stopColor={frontBot} stopOpacity="0.92" />
          </linearGradient>
        </defs>

        {(layer === 'back' || layer === 'all') && (
          <>
            <path
              d="M75 145 C45 145 20 125 20 95 C20 70 40 50 65 50 C75 25 105 10 140 10 C175 10 205 25 218 52 C232 42 255 42 270 56 C295 56 318 76 318 102 C318 130 295 148 268 148 C255 168 225 180 190 180 C155 180 125 168 105 152 Z"
              fill={`url(#cloudGrad0-back-${sunlitClass})`}
            />
            <path
              d="M85 55 C110 28 140 22 170 24 C150 32 135 48 130 65 C110 65 95 60 85 55 Z"
              fill={rimHighlight}
            />
          </>
        )}

        {(layer === 'front' || layer === 'all') && (
          <>
            <path
              d="M40 155 C55 130 90 128 120 142 C150 128 190 126 220 144 C245 130 280 134 305 156 C295 178 245 188 190 188 C135 188 75 182 40 155 Z"
              fill={`url(#cloudGrad0-front-${sunlitClass})`}
            />
            <path
              d="M100 140 C125 130 155 132 180 142 C155 146 130 148 100 140 Z"
              fill={rimHighlight}
              opacity="0.6"
            />
          </>
        )}
      </svg>
    );
  }

  if (v === 1) {
    // Soft rounded cloud pillow (320 x 180)
    return (
      <svg
        className={`cloud-svg-shape ${className}`}
        viewBox="0 0 320 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`cloudGrad1-back-${sunlitClass}`} x1="160" y1="8" x2="160" y2="174" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={topColor} stopOpacity="0.98" />
            <stop offset="65%" stopColor={midColor} stopOpacity="0.95" />
            <stop offset="100%" stopColor={botColor} stopOpacity="0.86" />
          </linearGradient>
          <linearGradient id={`cloudGrad1-front-${sunlitClass}`} x1="160" y1="120" x2="160" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={frontTop} stopOpacity="0.96" />
            <stop offset="100%" stopColor={frontBot} stopOpacity="0.92" />
          </linearGradient>
        </defs>

        {(layer === 'back' || layer === 'all') && (
          <>
            <path
              d="M60 140 C30 140 12 118 12 90 C12 62 34 45 60 45 C70 20 98 8 130 8 C168 8 198 25 208 50 C220 38 244 38 260 52 C285 52 305 72 305 98 C305 125 285 142 260 142 C248 162 218 174 185 174 C148 174 118 162 95 146 Z"
              fill={`url(#cloudGrad1-back-${sunlitClass})`}
            />
            <path
              d="M75 48 C95 24 125 18 155 20 C135 28 120 44 115 58 C98 58 85 52 75 48 Z"
              fill={rimHighlight}
            />
          </>
        )}

        {(layer === 'front' || layer === 'all') && (
          <>
            <path
              d="M30 145 C50 122 85 120 115 136 C145 122 180 120 210 136 C235 124 270 128 290 150 C275 170 230 180 180 180 C125 180 65 174 30 145 Z"
              fill={`url(#cloudGrad1-front-${sunlitClass})`}
            />
            <path
              d="M90 132 C115 124 145 125 170 134 C148 138 122 140 90 132 Z"
              fill={rimHighlight}
              opacity="0.6"
            />
          </>
        )}
      </svg>
    );
  }

  if (v === 2) {
    // Asymmetrical billowing cloud bank (350 x 195)
    return (
      <svg
        className={`cloud-svg-shape ${className}`}
        viewBox="0 0 350 195"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`cloudGrad2-back-${sunlitClass}`} x1="175" y1="8" x2="175" y2="188" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={topColor} stopOpacity="0.98" />
            <stop offset="70%" stopColor={midColor} stopOpacity="0.94" />
            <stop offset="100%" stopColor={botColor} stopOpacity="0.88" />
          </linearGradient>
          <linearGradient id={`cloudGrad2-front-${sunlitClass}`} x1="175" y1="126" x2="175" y2="194" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={frontTop} stopOpacity="0.96" />
            <stop offset="100%" stopColor={frontBot} stopOpacity="0.92" />
          </linearGradient>
        </defs>

        {(layer === 'back' || layer === 'all') && (
          <>
            <path
              d="M80 150 C48 150 20 128 20 98 C20 70 45 52 72 52 C84 24 116 8 155 8 C192 8 224 24 238 52 C255 40 282 42 298 58 C324 60 342 82 342 108 C342 135 320 154 290 154 C275 174 240 188 200 188 C160 188 126 174 102 156 Z"
              fill={`url(#cloudGrad2-back-${sunlitClass})`}
            />
            <path
              d="M92 56 C120 25 155 18 190 22 C168 30 150 48 144 64 C124 64 106 58 92 56 Z"
              fill={rimHighlight}
            />
          </>
        )}

        {(layer === 'front' || layer === 'all') && (
          <>
            <path
              d="M45 155 C65 130 100 128 130 144 C165 128 205 126 240 146 C268 132 305 138 328 160 C310 182 260 194 200 194 C140 194 80 185 45 155 Z"
              fill={`url(#cloudGrad2-front-${sunlitClass})`}
            />
            <path
              d="M110 140 C138 130 170 132 200 142 C172 146 142 148 110 140 Z"
              fill={rimHighlight}
              opacity="0.6"
            />
          </>
        )}
      </svg>
    );
  }

  // Variant 3: Compact fluffy cloud (310 x 175)
  return (
    <svg
      className={`cloud-svg-shape ${className}`}
      viewBox="0 0 310 175"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`cloudGrad3-back-${sunlitClass}`} x1="155" y1="10" x2="155" y2="168" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={topColor} stopOpacity="0.98" />
          <stop offset="65%" stopColor={midColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor={botColor} stopOpacity="0.87" />
        </linearGradient>
        <linearGradient id={`cloudGrad3-front-${sunlitClass}`} x1="155" y1="116" x2="155" y2="174" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={frontTop} stopOpacity="0.96" />
          <stop offset="100%" stopColor={frontBot} stopOpacity="0.92" />
        </linearGradient>
      </defs>

      {(layer === 'back' || layer === 'all') && (
        <>
          <path
            d="M65 135 C38 135 15 115 15 88 C15 62 36 46 62 46 C72 22 98 10 128 10 C162 10 190 26 202 50 C216 38 238 38 252 52 C275 52 294 70 294 95 C294 122 274 138 248 138 C236 158 206 168 175 168 C140 168 112 158 90 142 Z"
            fill={`url(#cloudGrad3-back-${sunlitClass})`}
          />
          <path
            d="M75 50 C98 26 128 20 156 22 C136 30 122 46 116 58 C98 58 86 52 75 50 Z"
            fill={rimHighlight}
          />
        </>
      )}

      {(layer === 'front' || layer === 'all') && (
        <>
          <path
            d="M35 140 C52 118 85 116 112 130 C140 116 175 116 200 132 C225 120 258 124 278 144 C265 164 225 174 175 174 C125 174 65 168 35 140 Z"
            fill={`url(#cloudGrad3-front-${sunlitClass})`}
          />
          <path
            d="M88 126 C112 118 140 120 165 128 C142 132 118 134 88 126 Z"
            fill={rimHighlight}
            opacity="0.6"
          />
        </>
      )}
    </svg>
  );
}
