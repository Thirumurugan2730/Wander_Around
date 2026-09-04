import React from 'react';
import MemoryPouch from './MemoryPouch';

/**
 * RealisticBird Component
 * Renders one of three distinct, realistic bird species modeled after real birds
 * (Eurasian Tree Sparrow, Slate-grey Becard/Warbler, Golden Weaver).
 * 
 * Features:
 * - Natural anatomical proportions, detailed plumage gradients, and eye catchlights
 * - Natural wing flap keyframes during flight and folded wings when perching
 * - Natural beak clutching the pouch twine
 * - Carries the physical MemoryPouch beneath
 */
export default function RealisticBird({
  birdIndex = 0, // 0: Sparrow/Finch, 1: Slate Becard, 2: Golden Weaver
  flightPhase = 'perched', // 'flying-in' | 'landing' | 'perched' | 'flying-out' | 'resting'
  post = null,
  onSelectPouch,
}) {
  const isFlying = flightPhase === 'flying-in' || flightPhase === 'flying-out' || flightPhase === 'landing';
  const isPerched = flightPhase === 'perched';

  // Species-specific color schemes
  const speciesClass = `bird-species-${birdIndex}`;

  return (
    <div
      className={`realistic-bird-rig ${speciesClass} phase-${flightPhase} ${isFlying ? 'is-airborne' : 'is-perched-bird'}`}
      aria-label={`Messenger bird ${birdIndex + 1}`}
    >
      <div className="bird-svg-container">
        <svg
          className="realistic-bird-svg"
          viewBox="0 0 120 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* SPECIES 0: Eurasian Tree Sparrow / Finch */}
            <linearGradient id="sparrowMantle" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7E4A28" />
              <stop offset="50%" stopColor="#5E361D" />
              <stop offset="100%" stopColor="#3E2010" />
            </linearGradient>
            <linearGradient id="sparrowBreast" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EADBCC" />
              <stop offset="60%" stopColor="#D5BFAB" />
              <stop offset="100%" stopColor="#B39B84" />
            </linearGradient>
            <linearGradient id="sparrowWing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8C532E" />
              <stop offset="60%" stopColor="#5A341A" />
              <stop offset="100%" stopColor="#321B0B" />
            </linearGradient>

            {/* SPECIES 1: Slate-grey & Olive Becard / Warbler */}
            <linearGradient id="becardMantle" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#607685" />
              <stop offset="50%" stopColor="#455663" />
              <stop offset="100%" stopColor="#2E3A42" />
            </linearGradient>
            <linearGradient id="becardBreast" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F4EDE2" />
              <stop offset="60%" stopColor="#DFD6C7" />
              <stop offset="100%" stopColor="#C2B7A3" />
            </linearGradient>
            <linearGradient id="becardWing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#506675" />
              <stop offset="60%" stopColor="#3B4B57" />
              <stop offset="100%" stopColor="#253038" />
            </linearGradient>

            {/* SPECIES 2: Golden Weaver */}
            <linearGradient id="weaverMantle" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D99B3B" />
              <stop offset="50%" stopColor="#AD6F20" />
              <stop offset="100%" stopColor="#78440D" />
            </linearGradient>
            <linearGradient id="weaverBreast" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFE49E" />
              <stop offset="60%" stopColor="#F5CD6A" />
              <stop offset="100%" stopColor="#D9A83B" />
            </linearGradient>
            <linearGradient id="weaverWing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A86E28" />
              <stop offset="60%" stopColor="#754714" />
              <stop offset="100%" stopColor="#472605" />
            </linearGradient>

            {/* Natural Beak Gradient */}
            <linearGradient id="beakGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#45382E" />
              <stop offset="60%" stopColor="#33271D" />
              <stop offset="100%" stopColor="#1E1610" />
            </linearGradient>
          </defs>

          {/* Far Wing (Airborne Flight Only) */}
          {isFlying && (
            <path
              className="bird-wing-far"
              d="M52 32 C 44 10, 26 0, 8 -4 C 20 6, 38 18, 48 34 Z"
              fill={
                birdIndex === 0
                  ? 'url(#sparrowWing)'
                  : birdIndex === 1
                  ? 'url(#becardWing)'
                  : 'url(#weaverWing)'
              }
              opacity="0.82"
            />
          )}

          {/* Tail Feathers with natural tiered layering */}
          <g className="bird-tail-fan">
            <path
              d="M18 45 L 2 56 C 5 49, 10 43, 19 41 Z"
              fill={birdIndex === 0 ? '#3A1E0C' : birdIndex === 1 ? '#28343D' : '#522E08'}
            />
            <path
              d="M19 48 L 4 62 C 8 53, 14 47, 21 43 Z"
              fill={birdIndex === 0 ? '#4E2B14' : birdIndex === 1 ? '#354550' : '#6E3E0C'}
            />
            <path
              d="M20 51 L 7 66 C 12 57, 16 51, 22 47 Z"
              fill={birdIndex === 0 ? '#63391C' : birdIndex === 1 ? '#465A68' : '#8A5012'}
            />
          </g>

          {/* Torso & Head Silhouette */}
          <path
            d="M22 42 C 22 30, 38 18, 58 18 C 73 18, 86 25, 92 35 C 88 52, 72 64, 48 64 C 33 64, 22 55, 22 42 Z"
            fill={
              birdIndex === 0
                ? 'url(#sparrowMantle)'
                : birdIndex === 1
                ? 'url(#becardMantle)'
                : 'url(#weaverMantle)'
            }
          />

          {/* Soft Breast & Belly Plumage */}
          <path
            d="M42 34 C 55 34, 72 38, 81 46 C 78 57, 65 64, 46 64 C 34 64, 27 58, 27 50 C 27 41, 34 34, 42 34 Z"
            fill={
              birdIndex === 0
                ? 'url(#sparrowBreast)'
                : birdIndex === 1
                ? 'url(#becardBreast)'
                : 'url(#weaverBreast)'
            }
          />

          {/* Species-Specific Plumage Marking */}
          {birdIndex === 0 && (
            /* Sparrow Crown & Dark Bib */
            <g className="sparrow-markings">
              <path d="M48 18 C 60 17, 75 22, 82 28 C 70 26, 56 24, 48 18 Z" fill="#4A230B" />
              <path d="M72 40 C 78 40, 84 45, 82 50 C 76 52, 70 48, 72 40 Z" fill="#25160C" opacity="0.8" />
            </g>
          )}

          {birdIndex === 1 && (
            /* Becard Soft Slate Cap */
            <path d="M46 18 C 58 17, 74 21, 80 27 C 68 25, 54 23, 46 18 Z" fill="#2B363E" opacity="0.6" />
          )}

          {birdIndex === 2 && (
            /* Weaver Warm Amber Mask */
            <path d="M70 30 C 80 30, 88 34, 90 40 C 82 42, 72 38, 70 30 Z" fill="#663505" opacity="0.75" />
          )}

          {/* Realistic Bird Eye with Catchlight */}
          <circle cx="78" cy="29" r="3.6" fill="#140E0A" />
          <circle cx="79.2" cy="27.8" r="1.3" fill="#FFFFFF" />

          {/* Realistic Cone Beak (Grasping Pouch String) */}
          <path
            d="M87 30 L 102 35 L 87 39 Z"
            fill="url(#beakGrad)"
          />

          {/* Near Wing (Foreground Wing) */}
          {isFlying ? (
            <path
              className="bird-wing-near flapping-wing"
              d="M52 34 C 46 8, 28 -4, 8 -8 C 22 6, 40 20, 50 40 Z"
              fill={
                birdIndex === 0
                  ? 'url(#sparrowWing)'
                  : birdIndex === 1
                  ? 'url(#becardWing)'
                  : 'url(#weaverWing)'
              }
            />
          ) : (
            <path
              className="bird-wing-folded perched-wing"
              d="M48 32 C 40 32, 25 38, 16 52 C 28 52, 45 48, 54 38 Z"
              fill={
                birdIndex === 0
                  ? 'url(#sparrowWing)'
                  : birdIndex === 1
                  ? 'url(#becardWing)'
                  : 'url(#weaverWing)'
              }
            />
          )}

          {/* Realistic Talons (Grasping branch or clutching pouch) */}
          <g className="bird-talons">
            <path
              d="M44 63 L 42 72 M 42 72 L 36 76 M 42 72 L 44 77 M 42 72 L 49 75"
              stroke="#594432"
              strokeWidth="2.0"
              strokeLinecap="round"
            />
            <path
              d="M52 63 L 50 72 M 50 72 L 44 76 M 50 72 L 52 77 M 50 72 L 57 75"
              stroke="#433122"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      {/* 2. Physical Memory Pouch Suspended from Bird */}
      {post && (
        <div className="bird-pouch-anchor">
          <MemoryPouch
            post={post}
            onSelect={onSelectPouch}
            isFlying={isFlying}
            isPerched={isPerched}
            pouchVariant={birdIndex % 3}
          />
        </div>
      )}
    </div>
  );
}
