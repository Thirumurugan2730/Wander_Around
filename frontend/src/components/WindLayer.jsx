import React from 'react';

/**
 * Visible Wind Trails & Floating Atmospheric Particles.
 * Creates a soft, continuous breeze carrying clouds across the nostalgic sky.
 */
export default function WindLayer() {
  return (
    <div className="wind-layer" aria-hidden="true">
      {/* Curved Translucent Wind Streaks */}
      <svg className="wind-svg" viewBox="0 0 1600 900" fill="none" preserveAspectRatio="none">
        {/* Wind Stream 1: High Sky Breeze */}
        <path
          className="wind-streak wind-streak-1"
          d="M-200 180 C 200 140, 600 220, 1000 160 C 1300 120, 1600 190, 1900 150"
          stroke="url(#windGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Wind Stream 2: Mid Sky Flow */}
        <path
          className="wind-streak wind-streak-2"
          d="M-300 380 C 150 420, 550 340, 950 400 C 1350 440, 1650 360, 2000 390"
          stroke="url(#windGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Wind Stream 3: Lower Breeze Arc */}
        <path
          className="wind-streak wind-streak-3"
          d="M-250 620 C 180 580, 580 660, 1020 590 C 1400 540, 1700 640, 1950 600"
          stroke="url(#windGrad)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Wind Stream 4: Gentle High Arc */}
        <path
          className="wind-streak wind-streak-4"
          d="M-150 80 C 300 110, 700 60, 1100 100 C 1450 130, 1750 70, 2050 90"
          stroke="url(#windGrad)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <defs>
          <linearGradient id="windGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="20%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="80%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Drifting Breeze Particles (Light Motes / Seeds) */}
      <div className="wind-particle particle-1" />
      <div className="wind-particle particle-2" />
      <div className="wind-particle particle-3" />
      <div className="wind-particle particle-4" />
      <div className="wind-particle particle-5" />
      <div className="wind-particle particle-6" />
    </div>
  );
}
