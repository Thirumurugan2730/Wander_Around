import React from 'react';
import NostalgicSun from './NostalgicSun';

/**
 * ForestScene Component
 * Renders the realistic, cinematic golden-hour forest with THREE prominent trees:
 * - Tree 0: Left Tree (Graceful Elm/Birch with lateral perching branch)
 * - Tree 1: Center Tree (Midground Spreading Oak with central perching branch)
 * - Tree 2: Right Tree (Ancient Mature Tree with sturdy landing branch)
 * - Clouds ONLY near the very top of the viewport
 * - Warm sunlight filtering through branches, natural shadows, and 5-second breeze
 */
export default function ForestScene({ bouncingTrees = { 0: false, 1: false, 2: false }, children }) {
  return (
    <div className="forest-scene-viewport">
      {/* Background Living Forest Elements (Non-interactive visual backdrop) */}
      <div className="forest-scenery-backdrop" aria-hidden="true">
        {/* 1. Golden Hour Sun in Upper Sky */}
        <NostalgicSun />

        {/* 2. Top-Only Distant Realistic Clouds (Strictly restricted to top 2%–12% sky band) */}
        <div className="top-sky-clouds-container">
          <div className="top-cloud top-cloud-1" />
          <div className="top-cloud top-cloud-2" />
          <div className="top-cloud top-cloud-3" />
        </div>

        {/* 3. Distant Rolling Forest Hills & Mountain Ridges */}
        <svg
          className="forest-distant-hills-svg"
          viewBox="0 0 1600 450"
          fill="none"
          preserveAspectRatio="none"
        >
          {/* Distant Mountain Silhouettes */}
          <path
            d="M0 320 Q 300 210, 620 280 T 1180 230 T 1600 300 L 1600 450 L 0 450 Z"
            fill="url(#deepHillGrad)"
            opacity="0.5"
          />
          {/* Mid-Distant Forest Canopy Ridge */}
          <path
            d="M0 360 Q 340 270, 750 330 T 1360 290 T 1600 350 L 1600 450 L 0 450 Z"
            fill="url(#midHillGrad)"
            opacity="0.75"
          />
          {/* Near Forest Horizon */}
          <path
            d="M0 400 Q 420 340, 920 390 T 1600 380 L 1600 450 L 0 450 Z"
            fill="url(#nearHillGrad)"
            opacity="0.95"
          />

          <defs>
            <linearGradient id="deepHillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7B93A6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#CDBDA8" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="midHillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5B7362" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#BBA68C" stopOpacity="0.98" />
            </linearGradient>
            <linearGradient id="nearHillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3E5443" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#7E6D56" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>

        {/* 4. Sunlight Shafts / Dappled Light Filtering Through Trees */}
        <div className="sunlight-shafts-overlay">
          <div className="sun-shaft shaft-1" />
          <div className="sun-shaft shaft-2" />
          <div className="sun-shaft shaft-3" />
        </div>

        {/* 5. THREE DISTINCT REALISTIC MATURE TREES */}

        {/* TREE 0: LEFT TREE (Graceful Elm/Birch) */}
        <div className={`forest-tree-container tree-left-container ${bouncingTrees[0] ? 'branch-bounce-active' : ''}`}>
          <svg className="tree-svg tree-left-svg" viewBox="0 0 500 800" fill="none" preserveAspectRatio="xMidYMax meet">
            <defs>
              <linearGradient id="leftBarkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#322216" />
                <stop offset="40%" stopColor="#4A3423" />
                <stop offset="80%" stopColor="#382518" />
                <stop offset="100%" stopColor="#24170E" />
              </linearGradient>
              <radialGradient id="leftFoliage1" cx="45%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#9BB568" />
                <stop offset="50%" stopColor="#627E3D" />
                <stop offset="100%" stopColor="#2E401A" />
              </radialGradient>
              <radialGradient id="leftFoliage2" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#B4CD7C" />
                <stop offset="50%" stopColor="#75934A" />
                <stop offset="100%" stopColor="#394E21" />
              </radialGradient>
            </defs>

            {/* Left Tree Trunk */}
            <path
              d="M120 800 C 135 680, 150 580, 170 460 C 190 350, 185 260, 210 160 L 222 160 C 200 260, 205 350, 190 460 C 170 580, 160 680, 155 800 Z"
              fill="url(#leftBarkGrad)"
            />

            {/* Main Perching Branch for Bird 0 (Reaches rightward into open view) */}
            <g className="tree-perch-branch branch-left">
              <path
                d="M185 390 C 235 385, 290 375, 345 365 C 380 358, 410 352, 440 345 L 440 339 C 410 345, 380 351, 345 358 C 290 368, 235 378, 185 382 Z"
                fill="url(#leftBarkGrad)"
              />
              {/* Branch Twig Offshoots */}
              <path d="M280 372 C 300 355, 315 345, 330 338 L 332 334 C 316 342, 301 351, 282 368 Z" fill="url(#leftBarkGrad)" />
            </g>

            {/* Left Sub-Branch */}
            <path
              d="M165 440 C 120 420, 80 395, 40 370 L 42 364 C 82 388, 122 414, 168 434 Z"
              fill="url(#leftBarkGrad)"
            />

            {/* Natural Canopy Leaf Clusters (Swaying in breeze) */}
            <g className="tree-foliage">
              <ellipse cx="210" cy="140" rx="85" ry="55" fill="url(#leftFoliage1)" className="leaf-cluster cluster-sway-1" />
              <ellipse cx="160" cy="170" rx="70" ry="48" fill="url(#leftFoliage2)" className="leaf-cluster cluster-sway-2" />
              <ellipse cx="270" cy="165" rx="75" ry="50" fill="url(#leftFoliage1)" className="leaf-cluster cluster-sway-3" />
              <ellipse cx="80" cy="360" rx="55" ry="38" fill="url(#leftFoliage2)" className="leaf-cluster cluster-sway-1" />
              <ellipse cx="290" cy="350" rx="45" ry="30" fill="url(#leftFoliage1)" className="leaf-cluster cluster-sway-2" />
            </g>
          </svg>
        </div>

        {/* TREE 1: CENTER TREE (Mature Spreading Oak in Midground) */}
        <div className={`forest-tree-container tree-center-container ${bouncingTrees[1] ? 'branch-bounce-active' : ''}`}>
          <svg className="tree-svg tree-center-svg" viewBox="0 0 600 800" fill="none" preserveAspectRatio="xMidYMax meet">
            <defs>
              <linearGradient id="centerBarkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2A1B10" />
                <stop offset="50%" stopColor="#432D1D" />
                <stop offset="100%" stopColor="#1E120A" />
              </linearGradient>
              <radialGradient id="centerFoliage1" cx="50%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#A8C372" />
                <stop offset="50%" stopColor="#6C8A42" />
                <stop offset="100%" stopColor="#32451C" />
              </radialGradient>
              <radialGradient id="centerFoliage2" cx="45%" cy="35%" r="70%">
                <stop offset="0%" stopColor="#BFD989" />
                <stop offset="50%" stopColor="#80A050" />
                <stop offset="100%" stopColor="#3F5625" />
              </radialGradient>
            </defs>

            {/* Center Oak Trunk */}
            <path
              d="M280 800 C 285 680, 290 560, 295 440 C 300 340, 290 260, 295 180 L 308 180 C 305 260, 312 340, 310 440 C 315 560, 325 680, 335 800 Z"
              fill="url(#centerBarkGrad)"
            />

            {/* Main Perching Branch for Bird 1 (Extends left-center) */}
            <g className="tree-perch-branch branch-center">
              <path
                d="M298 375 C 240 370, 180 358, 125 348 C 95 342, 70 338, 45 330 L 45 324 C 70 332, 95 336, 125 342 C 180 352, 240 363, 298 368 Z"
                fill="url(#centerBarkGrad)"
              />
              <path d="M190 358 C 170 342, 150 332, 130 324 L 132 320 C 152 328, 172 338, 192 354 Z" fill="url(#centerBarkGrad)" />
            </g>

            {/* Right Spreading Branch */}
            <path
              d="M308 340 C 365 325, 420 305, 475 280 L 478 274 C 422 299, 366 319, 308 333 Z"
              fill="url(#centerBarkGrad)"
            />

            {/* Oak Foliage Canopies */}
            <g className="tree-foliage">
              <ellipse cx="300" cy="160" rx="105" ry="68" fill="url(#centerFoliage1)" className="leaf-cluster cluster-sway-2" />
              <ellipse cx="230" cy="200" rx="85" ry="55" fill="url(#centerFoliage2)" className="leaf-cluster cluster-sway-1" />
              <ellipse cx="370" cy="195" rx="90" ry="58" fill="url(#centerFoliage1)" className="leaf-cluster cluster-sway-3" />
              <ellipse cx="110" cy="335" rx="60" ry="40" fill="url(#centerFoliage2)" className="leaf-cluster cluster-sway-2" />
              <ellipse cx="460" cy="270" rx="70" ry="46" fill="url(#centerFoliage1)" className="leaf-cluster cluster-sway-1" />
            </g>
          </svg>
        </div>

        {/* TREE 2: RIGHT TREE (Ancient Mature Tree) */}
        <div className={`forest-tree-container tree-right-container ${bouncingTrees[2] ? 'branch-bounce-active' : ''}`}>
          <svg className="tree-svg tree-right-svg" viewBox="0 0 600 850" fill="none" preserveAspectRatio="xMidYMax meet">
            <defs>
              <linearGradient id="rightBarkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3C2A1E" />
                <stop offset="40%" stopColor="#543C2A" />
                <stop offset="80%" stopColor="#442E1F" />
                <stop offset="100%" stopColor="#281A10" />
              </linearGradient>
              <radialGradient id="rightFoliage1" cx="45%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#92AF5E" />
                <stop offset="50%" stopColor="#587236" />
                <stop offset="100%" stopColor="#283916" />
              </radialGradient>
              <radialGradient id="rightFoliage2" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ABCA75" />
                <stop offset="50%" stopColor="#6F8D43" />
                <stop offset="100%" stopColor="#374B1E" />
              </radialGradient>
            </defs>

            {/* Right Tree Trunk */}
            <path
              d="M400 850 C 390 730, 375 620, 365 500 C 355 380, 365 290, 345 190 L 358 190 C 378 290, 370 380, 380 500 C 395 620, 420 730, 440 850 Z"
              fill="url(#rightBarkGrad)"
            />

            {/* Main Perching Branch for Bird 2 (Sweeps toward center-left) */}
            <g className="tree-perch-branch branch-right">
              <path
                d="M368 410 C 300 405, 230 392, 160 382 C 120 376, 85 372, 50 365 L 50 359 C 85 366, 120 370, 160 376 C 230 386, 300 398, 368 403 Z"
                fill="url(#rightBarkGrad)"
              />
              <path d="M220 390 C 200 375, 180 365, 160 358 L 162 354 C 182 361, 202 371, 222 386 Z" fill="url(#rightBarkGrad)" />
            </g>

            {/* Upper Right Branch */}
            <path
              d="M360 280 C 410 255, 460 225, 510 190 L 514 184 C 464 219, 413 249, 362 273 Z"
              fill="url(#rightBarkGrad)"
            />

            {/* Foliage Clusters */}
            <g className="tree-foliage">
              <ellipse cx="340" cy="160" rx="100" ry="65" fill="url(#rightFoliage1)" className="leaf-cluster cluster-sway-3" />
              <ellipse cx="270" cy="200" rx="80" ry="52" fill="url(#rightFoliage2)" className="leaf-cluster cluster-sway-1" />
              <ellipse cx="440" cy="190" rx="85" ry="55" fill="url(#rightFoliage1)" className="leaf-cluster cluster-sway-2" />
              <ellipse cx="120" cy="365" rx="55" ry="36" fill="url(#rightFoliage2)" className="leaf-cluster cluster-sway-3" />
              <ellipse cx="490" cy="180" rx="65" ry="42" fill="url(#rightFoliage1)" className="leaf-cluster cluster-sway-1" />
            </g>
          </svg>
        </div>

        {/* 6. Wind Motes & Subtle Golden Particles */}
        <div className="forest-wind-particles">
          <div className="forest-mote mote-1" />
          <div className="forest-mote mote-2" />
          <div className="forest-mote mote-3" />
          <div className="forest-mote mote-4" />
          <div className="forest-mote mote-5" />
        </div>
      </div>

      {/* Interactive Layer: 3 Realistic Messenger Birds & Memory Pouches */}
      {children}
    </div>
  );
}
