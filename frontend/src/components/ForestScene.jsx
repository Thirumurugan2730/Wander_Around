import React from 'react';
import NostalgicSun from './NostalgicSun';

/**
 * ForestScene Component
 * Renders the living nostalgic golden-hour forest environment:
 * - Peaceful sky with golden hour gradient and subtle film grain
 * - Golden sun with atmospheric aura and sunbeams
 * - Distant mountain silhouettes and misty tree layers
 * - The Main Ancient Tree with natural spreading branches, foliage clusters, and designated landing perch
 * - Subtle secondary background tree for spatial balance
 * - Floating golden motes, autumn leaves, and 5-second breeze currents
 */
export default function ForestScene({ isBranchBouncing = false, children }) {
  return (
    <div className="forest-scene-viewport">
      {/* Background Living Forest Elements */}
      <div className="forest-scenery-backdrop" aria-hidden="true">
        {/* 1. Golden Hour Sun in Upper Sky */}
        <NostalgicSun />

      {/* 2. Soft Ambient Sky Clouds (drifting high in the atmosphere) */}
      <div className="forest-ambient-cloud cloud-far-1" />
      <div className="forest-ambient-cloud cloud-far-2" />
      <div className="forest-ambient-cloud cloud-far-3" />

      {/* 3. Distant Rolling Hills & Mountain Silhouettes */}
      <svg
        className="forest-distant-hills-svg"
        viewBox="0 0 1600 500"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* Deep Background Mountain Ridge */}
        <path
          d="M0 380 Q 280 240, 580 320 T 1120 260 T 1600 340 L 1600 500 L 0 500 Z"
          fill="url(#deepRidgeGrad)"
          opacity="0.45"
        />
        {/* Mid-Distant Forest Ridge */}
        <path
          d="M0 410 Q 320 310, 720 370 T 1320 330 T 1600 390 L 1600 500 L 0 500 Z"
          fill="url(#midRidgeGrad)"
          opacity="0.65"
        />
        {/* Near Hill Crest */}
        <path
          d="M0 450 Q 400 380, 880 430 T 1600 420 L 1600 500 L 0 500 Z"
          fill="url(#nearHillGrad)"
          opacity="0.85"
        />

        <defs>
          <linearGradient id="deepRidgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8DA3B5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#D5C5B0" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="midRidgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6C8276" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#C4B097" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="nearHillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4D6353" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#8A775F" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

      {/* 4. Secondary Background Tree (Far Left) for visual balance */}
      <div className="forest-secondary-tree" />

      {/* 5. The Main Ancient Tree (Center-Right Foreground) */}
      <div className={`forest-main-tree-container ${isBranchBouncing ? 'branch-bounce-active' : ''}`}>
        <svg
          className="forest-tree-svg"
          viewBox="0 0 700 900"
          fill="none"
          preserveAspectRatio="xMidYMax meet"
        >
          <defs>
            {/* Trunk & Bark Wood Gradient */}
            <linearGradient id="barkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3C2A1E" />
              <stop offset="30%" stopColor="#563E2D" />
              <stop offset="70%" stopColor="#4A3425" />
              <stop offset="100%" stopColor="#2E1F16" />
            </linearGradient>

            {/* Sunlit Branch Gradient */}
            <linearGradient id="branchSunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#70523A" />
              <stop offset="100%" stopColor="#3D291D" />
            </linearGradient>

            {/* Lush Canopy Foliage Gradients */}
            <radialGradient id="foliageGrad1" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#8EA863" />
              <stop offset="45%" stopColor="#5E783D" />
              <stop offset="85%" stopColor="#3D5327" />
              <stop offset="100%" stopColor="#2A3C19" />
            </radialGradient>

            <radialGradient id="foliageGrad2" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#A4BE74" />
              <stop offset="50%" stopColor="#6C8845" />
              <stop offset="85%" stopColor="#445E2A" />
              <stop offset="100%" stopColor="#2C401B" />
            </radialGradient>

            <radialGradient id="foliageSunlit" cx="50%" cy="25%" r="60%">
              <stop offset="0%" stopColor="#CFDC8E" />
              <stop offset="40%" stopColor="#9AB85E" />
              <stop offset="80%" stopColor="#5B7637" />
              <stop offset="100%" stopColor="#36491E" />
            </radialGradient>
          </defs>

          {/* Tree Trunk Base */}
          <path
            d="M480 900 C 470 780, 450 670, 440 540 C 430 420, 445 320, 410 220 C 390 170, 360 130, 340 90 L 355 90 C 385 140, 415 185, 435 240 C 465 330, 460 430, 475 550 C 490 670, 520 780, 545 900 Z"
            fill="url(#barkGrad)"
          />

          {/* Root Flairs */}
          <path
            d="M480 900 C 440 860, 390 870, 350 900 L 480 900 Z"
            fill="#2E1F16"
            opacity="0.8"
          />
          <path
            d="M545 900 C 585 865, 630 875, 670 900 L 545 900 Z"
            fill="#2E1F16"
            opacity="0.8"
          />

          {/* Left Upper Branch Sub-system */}
          <path
            d="M430 380 C 370 360, 310 330, 240 310 C 190 295, 140 290, 80 270 L 85 260 C 145 278, 195 285, 245 300 C 315 320, 375 348, 435 368 Z"
            fill="url(#branchSunGrad)"
          />

          {/* MAIN PERCHING BRANCH (Where the Bird Lands & Memory is Settled) */}
          <g className="main-perch-branch-group">
            <path
              className="main-perch-branch-path"
              d="M440 450 C 360 445, 280 430, 200 420 C 145 412, 105 408, 60 395 C 45 390, 35 388, 20 385 L 20 378 C 40 380, 55 383, 70 388 C 115 399, 150 404, 205 412 C 285 422, 365 435, 445 440 Z"
              fill="url(#branchSunGrad)"
            />

            {/* Small Perch Twig Offshoots */}
            <path
              d="M130 407 C 115 390, 95 380, 75 370 L 78 366 C 98 375, 118 385, 134 402 Z"
              fill="url(#branchSunGrad)"
            />
            <path
              d="M210 422 C 200 402, 185 390, 165 382 L 168 378 C 188 386, 204 398, 214 418 Z"
              fill="url(#branchSunGrad)"
            />
          </g>

          {/* Right Upper Branch Structure */}
          <path
            d="M440 300 C 490 270, 540 240, 590 200 C 625 170, 655 140, 680 100 L 688 106 C 660 148, 630 178, 595 208 C 545 248, 495 278, 445 310 Z"
            fill="url(#branchSunGrad)"
          />

          {/* Right Lower Branch */}
          <path
            d="M465 470 C 520 460, 575 440, 625 415 C 655 400, 680 380, 700 355 L 705 362 C 682 388, 658 408, 628 424 C 578 448, 522 468, 468 478 Z"
            fill="url(#branchSunGrad)"
          />

          {/* Canopy Leaf Clusters (Organically placed foliage clouds swaying in wind) */}
          <g className="tree-foliage-clusters">
            {/* Top Crown Cluster */}
            <ellipse cx="360" cy="90" rx="95" ry="60" fill="url(#foliageSunlit)" className="leaf-cluster cluster-sway-1" />
            <ellipse cx="320" cy="110" rx="75" ry="50" fill="url(#foliageGrad1)" className="leaf-cluster cluster-sway-2" />
            <ellipse cx="400" cy="115" rx="80" ry="52" fill="url(#foliageGrad2)" className="leaf-cluster cluster-sway-3" />

            {/* Upper Left Foliage */}
            <ellipse cx="190" cy="275" rx="85" ry="52" fill="url(#foliageGrad1)" className="leaf-cluster cluster-sway-1" />
            <ellipse cx="130" cy="260" rx="70" ry="45" fill="url(#foliageSunlit)" className="leaf-cluster cluster-sway-2" />
            <ellipse cx="90" cy="285" rx="55" ry="38" fill="url(#foliageGrad2)" className="leaf-cluster cluster-sway-3" />

            {/* Main Perch Foliage Accent (Behind & Above the perch, leaving open space for bird) */}
            <ellipse cx="95" cy="375" rx="45" ry="30" fill="url(#foliageGrad1)" className="leaf-cluster cluster-sway-2" />
            <ellipse cx="160" cy="390" rx="50" ry="32" fill="url(#foliageSunlit)" className="leaf-cluster cluster-sway-1" />

            {/* Right Crown & Mid Foliage */}
            <ellipse cx="580" cy="180" rx="90" ry="55" fill="url(#foliageSunlit)" className="leaf-cluster cluster-sway-3" />
            <ellipse cx="640" cy="120" rx="70" ry="48" fill="url(#foliageGrad1)" className="leaf-cluster cluster-sway-1" />
            <ellipse cx="610" cy="390" rx="80" ry="50" fill="url(#foliageGrad2)" className="leaf-cluster cluster-sway-2" />
            <ellipse cx="665" cy="360" rx="65" ry="42" fill="url(#foliageSunlit)" className="leaf-cluster cluster-sway-3" />
          </g>
        </svg>
      </div>

      {/* 6. Wind Currents, Drifting Leaves & Golden Motes */}
      <div className="forest-wind-particles">
        <div className="breeze-leaf leaf-1" />
        <div className="breeze-leaf leaf-2" />
        <div className="breeze-leaf leaf-3" />
        <div className="breeze-leaf leaf-4" />
        <div className="forest-mote mote-1" />
        <div className="forest-mote mote-2" />
        <div className="forest-mote mote-3" />
        <div className="forest-mote mote-4" />
        <div className="forest-mote mote-5" />
      </div>
      </div>

      {/* Interactive Layer: Children container for Carrier Bird and Drifting Notes */}
      {children}
    </div>
  );
}
