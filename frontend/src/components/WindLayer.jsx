import React from 'react';

/**
 * Visible Wind Trails, Wispy Breeze Ribbons & Floating Sunlit Motes.
 * Creates an authentic living atmosphere where the user physically SEES the wind
 * carrying today's clouds and memories across the nostalgic sky.
 */
export default function WindLayer() {
  return (
    <div className="wind-layer" aria-hidden="true">
      {/* Translucent Curved Wind Streams (Airflow Currents) */}
      <svg className="wind-svg" viewBox="0 0 1600 900" fill="none" preserveAspectRatio="none">
        {/* Stream 1: High Sky Sunward Breeze */}
        <path
          className="wind-streak wind-streak-1"
          d="M-250 140 C 220 110, 640 180, 1060 120 C 1380 90, 1680 160, 2050 120"
          stroke="url(#windSunGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Stream 2: Upper Mid-Sky Current */}
        <path
          className="wind-streak wind-streak-2"
          d="M-320 290 C 180 340, 580 260, 980 320 C 1380 370, 1680 280, 2080 310"
          stroke="url(#windGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Stream 3: Mid-Sky Gentle Sway */}
        <path
          className="wind-streak wind-streak-3"
          d="M-280 480 C 160 430, 560 520, 1020 460 C 1420 410, 1720 500, 2020 470"
          stroke="url(#windGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Stream 4: Lower Sky Horizon Breeze */}
        <path
          className="wind-streak wind-streak-4"
          d="M-300 680 C 200 640, 620 720, 1080 660 C 1440 610, 1750 710, 2050 670"
          stroke="url(#windWarmGrad)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Stream 5: Subtle High Cirrus Streak */}
        <path
          className="wind-streak wind-streak-5"
          d="M-180 70 C 320 95, 720 45, 1140 85 C 1480 115, 1780 60, 2100 80"
          stroke="url(#windSunGrad)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        <defs>
          {/* Neutral Atmospheric Wind Stream Gradient */}
          <linearGradient id="windGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="15%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Sunlit Golden Stream Gradient */}
          <linearGradient id="windSunGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFF9E0" stopOpacity="0" />
            <stop offset="20%" stopColor="#FFF3C4" stopOpacity="0.4" />
            <stop offset="55%" stopColor="#FFECA8" stopOpacity="0.8" />
            <stop offset="85%" stopColor="#FFF3C4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFF9E0" stopOpacity="0" />
          </linearGradient>

          {/* Warm Horizon Stream Gradient */}
          <linearGradient id="windWarmGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FAF2E8" stopOpacity="0" />
            <stop offset="25%" stopColor="#FAF2E8" stopOpacity="0.35" />
            <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.65" />
            <stop offset="85%" stopColor="#FAF2E8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FAF2E8" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Wispy Cloud Breeze Ribbons (Feathered Vapor Bands) */}
      <div className="breeze-ribbon breeze-ribbon-1" />
      <div className="breeze-ribbon breeze-ribbon-2" />
      <div className="breeze-ribbon breeze-ribbon-3" />

      {/* Floating Sunlit Motes & Seeds (Golden Summer Airflow) */}
      <div className="wind-particle particle-sun-1" />
      <div className="wind-particle particle-sun-2" />
      <div className="wind-particle particle-sun-3" />
      <div className="wind-particle particle-sun-4" />
      <div className="wind-particle particle-sun-5" />
      <div className="wind-particle particle-sun-6" />
      <div className="wind-particle particle-sun-7" />
      <div className="wind-particle particle-sun-8" />

      {/* Translucent Floating White Cloud Motes */}
      <div className="wind-particle particle-seed-1" />
      <div className="wind-particle particle-seed-2" />
      <div className="wind-particle particle-seed-3" />
      <div className="wind-particle particle-seed-4" />
      <div className="wind-particle particle-seed-5" />
      <div className="wind-particle particle-seed-6" />
      <div className="wind-particle particle-seed-7" />
      <div className="wind-particle particle-seed-8" />
    </div>
  );
}
