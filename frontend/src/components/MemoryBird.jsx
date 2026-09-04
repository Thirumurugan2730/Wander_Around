import React from 'react';

/**
 * MemoryBird Component
 * The messenger bird carrying people's memories through the nostalgic forest.
 * 
 * Anatomy & Animations:
 * - Handcrafted SVG messenger bird (warm slate-blue, cream breast, amber beak)
 * - Articulated flapping wings (active flapping cycle during flight; folded smoothly when perched)
 * - Gripping talons holding the photograph during transit and grasping the branch when perched
 * - Natural head, eye catchlight, and tail feathers with subtle breeze flutter
 */
export default function MemoryBird({
  flightPhase = 'perched', // 'flying-in' | 'landing' | 'perched' | 'flying-out' | 'resting'
  hasPhoto = true,
  children, // The physical photograph / memory being carried
}) {
  const isFlying = flightPhase === 'flying-in' || flightPhase === 'flying-out' || flightPhase === 'landing';
  const isPerched = flightPhase === 'perched';

  return (
    <div
      className={`memory-bird-carrier phase-${flightPhase} ${isFlying ? 'is-airborne' : 'is-grounded'}`}
      aria-label="Messenger bird carrying a memory"
    >
      {/* 1. Bird Character SVG */}
      <div className="bird-body-rig">
        <svg
          className="bird-svg"
          viewBox="0 0 140 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Mantle & Back Slate-Teal Gradient */}
            <linearGradient id="birdBackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#678A9C" />
              <stop offset="50%" stopColor="#476575" />
              <stop offset="100%" stopColor="#2F4450" />
            </linearGradient>

            {/* Warm Cream Breast Gradient */}
            <linearGradient id="birdBreastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF2DC" />
              <stop offset="60%" stopColor="#F5D8B2" />
              <stop offset="100%" stopColor="#DFB485" />
            </linearGradient>

            {/* Wing Feather Gradient */}
            <linearGradient id="birdWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#557587" />
              <stop offset="60%" stopColor="#3B5260" />
              <stop offset="100%" stopColor="#25353F" />
            </linearGradient>

            {/* Beak Amber Gradient */}
            <linearGradient id="birdBeakGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FBB954" />
              <stop offset="100%" stopColor="#E28928" />
            </linearGradient>
          </defs>

          {/* Far Wing (Behind Body during flight) */}
          {isFlying && (
            <path
              className="bird-wing-far"
              d="M60 40 C 50 15, 30 5, 10 2 C 25 15, 45 28, 55 42 Z"
              fill="url(#birdWingGrad)"
              opacity="0.85"
            />
          )}

          {/* Tail Feathers */}
          <g className="bird-tail-group">
            <path
              d="M20 52 L 2 64 C 6 56, 12 50, 22 48 Z"
              fill="#2C3D49"
            />
            <path
              d="M22 55 L 4 70 C 9 60, 16 54, 24 50 Z"
              fill="#3B5260"
            />
            <path
              d="M23 58 L 8 74 C 13 65, 18 58, 25 54 Z"
              fill="#4E6B7C"
            />
          </g>

          {/* Main Torso & Head Silhouette */}
          <path
            d="M25 50 C 25 35, 45 22, 68 22 C 85 22, 100 30, 108 42 C 104 62, 85 75, 55 75 C 38 75, 25 65, 25 50 Z"
            fill="url(#birdBackGrad)"
          />

          {/* Warm Breast / Belly Overlay */}
          <path
            d="M50 42 C 65 42, 85 46, 95 55 C 92 68, 76 75, 54 75 C 40 75, 32 68, 32 58 C 32 48, 40 42, 50 42 Z"
            fill="url(#birdBreastGrad)"
          />

          {/* Cute Nostalgic Eye */}
          <circle cx="92" cy="36" r="4.5" fill="#1C140D" />
          <circle cx="93.5" cy="34.5" r="1.8" fill="#FFFFFF" />

          {/* Amber Beak */}
          <path
            d="M102 36 L 118 42 L 102 46 Z"
            fill="url(#birdBeakGrad)"
          />

          {/* Near Wing (Foreground wing with flapping/folded animation) */}
          {isFlying ? (
            <path
              className="bird-wing-near flapping-wing"
              d="M62 42 C 55 12, 35 -2, 12 -8 C 28 8, 48 24, 60 48 Z"
              fill="url(#birdWingGrad)"
            />
          ) : (
            <path
              className="bird-wing-folded perched-wing"
              d="M58 40 C 48 40, 30 46, 20 62 C 35 62, 55 58, 65 46 Z"
              fill="url(#birdWingGrad)"
            />
          )}

          {/* Talons / Feet (Grasping branch or clutching photo) */}
          <g className="bird-talons-group">
            {/* Front Foot */}
            <path
              d="M52 74 L 50 84 M 50 84 L 44 88 M 50 84 L 52 89 M 50 84 L 58 87"
              stroke="#D48B38"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            {/* Back Foot */}
            <path
              d="M62 74 L 60 84 M 60 84 L 54 88 M 60 84 L 62 89 M 60 84 L 68 87"
              stroke="#B36E22"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      {/* 2. Photograph / Memory Payload carried by the bird */}
      {hasPhoto && children && (
        <div className={`bird-payload-anchor ${isPerched ? 'payload-settled' : 'payload-in-flight'}`}>
          {children}
        </div>
      )}
    </div>
  );
}
