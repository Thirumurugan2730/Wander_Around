import React from 'react';

/**
 * WindLayer
 * Visible, subtle wind currents and gentle recurring 5-second breeze wave.
 * Translucent thin curved wisps, gentle atmospheric streaks, and drifting golden motes.
 */
export default function WindLayer() {
  return (
    <div className="wind-layer" aria-hidden="true">
      {/* Translucent Thin Curved Wind Streams (Airflow Currents) */}
      <svg className="wind-svg" viewBox="0 0 1600 900" fill="none" preserveAspectRatio="none">
        {/* Stream 1: High Sky Sunward Breeze */}
        <path
          className="wind-streak wind-streak-1"
          d="M-250 140 C 220 110, 640 170, 1060 120 C 1380 90, 1680 150, 2050 120"
          stroke="url(#windSunGrad)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Stream 2: Upper Mid-Sky Current */}
        <path
          className="wind-streak wind-streak-2"
          d="M-320 290 C 180 330, 580 265, 980 315 C 1380 360, 1680 280, 2080 305"
          stroke="url(#windGrad)"
          strokeWidth="2.0"
          strokeLinecap="round"
        />

        {/* Stream 3: Mid-Sky Gentle Sway */}
        <path
          className="wind-streak wind-streak-3"
          d="M-280 480 C 160 435, 560 515, 1020 460 C 1420 415, 1720 495, 2020 470"
          stroke="url(#windGrad)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Stream 4: Lower Sky Horizon Breeze */}
        <path
          className="wind-streak wind-streak-4"
          d="M-300 680 C 200 645, 620 715, 1080 660 C 1440 615, 1750 705, 2050 670"
          stroke="url(#windWarmGrad)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Stream 5: Subtle High Cirrus Streak */}
        <path
          className="wind-streak wind-streak-5"
          d="M-180 70 C 320 95, 720 50, 1140 85 C 1480 110, 1780 65, 2100 80"
          stroke="url(#windSunGrad)"
          strokeWidth="1.3"
          strokeLinecap="round"
        />

        <defs>
          {/* Neutral Atmospheric Wind Stream Gradient */}
          <linearGradient id="windGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="15%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Sunlit Golden Stream Gradient */}
          <linearGradient id="windSunGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFF9E0" stopOpacity="0" />
            <stop offset="20%" stopColor="#FFF3C4" stopOpacity="0.35" />
            <stop offset="55%" stopColor="#FFECA8" stopOpacity="0.7" />
            <stop offset="85%" stopColor="#FFF3C4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FFF9E0" stopOpacity="0" />
          </linearGradient>

          {/* Warm Horizon Stream Gradient */}
          <linearGradient id="windWarmGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FAF2E8" stopOpacity="0" />
            <stop offset="25%" stopColor="#FAF2E8" stopOpacity="0.3" />
            <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="85%" stopColor="#FAF2E8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FAF2E8" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Gentle 5-Second Recurring Breeze Wave (Sweeps Left → Center → Right) */}
      <div className="wind-travel-wave" />

      {/* Translucent Wispy Breeze Ribbons */}
      <div className="breeze-ribbon breeze-ribbon-1" />
      <div className="breeze-ribbon breeze-ribbon-2" />
      <div className="breeze-ribbon breeze-ribbon-3" />

      {/* Floating Sunlit Motes & Seeds (Golden Summer Airflow) */}
      <div className="wind-particle particle-sun-1" />
      <div className="wind-particle particle-sun-2" />
      <div className="wind-particle particle-sun-3" />
      <div className="wind-particle particle-sun-4" />
      <div className="wind-particle particle-sun-5" />
      <div className="wind-particle particle-seed-1" />
      <div className="wind-particle particle-seed-2" />
      <div className="wind-particle particle-seed-3" />
      <div className="wind-particle particle-seed-4" />
    </div>
  );
}
