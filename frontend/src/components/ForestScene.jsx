import React from 'react';
import NostalgicSun from './NostalgicSun';

/**
 * ForestScene Component
 * High-Realism Cinematic Golden-Hour Forest with THREE mature, botanically detailed trees:
 * 
 * 1. Tree 0 (Left): Ancient Gnarled Broadleaf with deep bark furrows, swollen branch collars,
 *    massive root flare, multi-tiered biological branching, and layered canopy with sky gaps.
 * 2. Tree 1 (Center): Tall Mature Forest Tree in midground with high spreading limbs,
 *    vertical bark fissures, and dappled sunlight filtering through open crown branches.
 * 3. Tree 2 (Right): Older Asymmetrical Leaning Tree with heavy lateral limbs, natural wood scars,
 *    broken dead twigs, and sunlit foliage edges.
 * 
 * Top-only clouds (<12% height), dappled light shafts, and realistic forest floor.
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

        {/* 3. Distant Forest Ridges & Atmospheric Mountains */}
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
            opacity="0.45"
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

        {/* 4. Sunlight Shafts / Dappled Light Filtering Through Canopies */}
        <div className="sunlight-shafts-overlay">
          <div className="sun-shaft shaft-1" />
          <div className="sun-shaft shaft-2" />
          <div className="sun-shaft shaft-3" />
        </div>

        {/* ==========================================================================
           5. THREE BOTANICALLY REALISTIC MATURE FOREST TREES
           ========================================================================== */}

        {/* TREE 0: LEFT TREE (Ancient Gnarled Broadleaf) */}
        <div className={`forest-tree-container tree-left-container ${bouncingTrees[0] ? 'branch-bounce-active' : ''}`}>
          <svg className="tree-svg tree-left-svg" viewBox="0 0 540 850" fill="none" preserveAspectRatio="xMidYMax meet">
            <defs>
              {/* Bark Gradient with Deep Shadow Grooves & Golden Rim Highlights */}
              <linearGradient id="t1BarkBase" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1C120A" />
                <stop offset="25%" stopColor="#382517" />
                <stop offset="55%" stopColor="#523924" />
                <stop offset="85%" stopColor="#3E2818" />
                <stop offset="100%" stopColor="#22140A" />
              </linearGradient>
              <linearGradient id="t1BarkHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7A5636" />
                <stop offset="100%" stopColor="#322012" />
              </linearGradient>

              {/* Foliage Gradients: Shadow -> Mid -> Sunlit */}
              <radialGradient id="t1FoliageShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#364A1C" />
                <stop offset="60%" stopColor="#243412" />
                <stop offset="100%" stopColor="#141E0A" />
              </radialGradient>
              <radialGradient id="t1FoliageMid" cx="45%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#6C8B3B" />
                <stop offset="60%" stopColor="#4A6424" />
                <stop offset="100%" stopColor="#2A3C13" />
              </radialGradient>
              <radialGradient id="t1FoliageSun" cx="40%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#AEC96B" />
                <stop offset="50%" stopColor="#7E9E44" />
                <stop offset="100%" stopColor="#466020" />
              </radialGradient>
            </defs>

            {/* Deep Root Flare & Moss Base */}
            <path
              d="M70 850 C 95 810, 115 780, 135 720 C 145 680, 140 640, 145 570 C 150 490, 155 420, 175 340 C 190 280, 185 220, 195 150 L 210 150 C 200 220, 205 280, 195 340 C 175 420, 175 490, 170 570 C 165 640, 180 680, 205 740 C 225 790, 255 820, 285 850 Z"
              fill="url(#t1BarkBase)"
            />

            {/* Exposed Buttress Roots Gripping Forest Floor */}
            <path d="M70 850 C 90 830, 120 810, 140 760 L 148 765 C 130 815, 100 838, 70 850 Z" fill="#1C120A" opacity="0.85" />
            <path d="M285 850 C 265 830, 235 810, 215 760 L 208 765 C 228 815, 258 838, 285 850 Z" fill="#1C120A" opacity="0.85" />
            <path d="M125 850 C 140 825, 155 800, 160 760 L 166 762 C 160 805, 145 830, 125 850 Z" fill="#2E1C0F" />

            {/* Bark Fissures & Wood Grain Grooves (Micro-Detail) */}
            <g className="bark-fissures" stroke="#160E08" strokeWidth="1.6" strokeLinecap="round" opacity="0.75">
              <path d="M148 710 C 146 660, 152 610, 150 560 C 148 500, 156 440, 162 380" />
              <path d="M165 730 C 160 670, 168 620, 164 550 C 162 490, 170 430, 176 370" />
              <path d="M182 720 C 178 650, 184 590, 180 520 C 178 460, 184 410, 188 350" />
              <path d="M155 640 C 160 620, 162 600, 158 580" strokeWidth="2.2" />
              {/* Natural Knot / Scar */}
              <ellipse cx="166" cy="480" rx="6" ry="10" fill="#100A05" />
              <path d="M158 470 C 158 480, 160 495, 164 505 M174 470 C 174 480, 172 495, 168 505" stroke="#4A3423" strokeWidth="1.2" />
            </g>

            {/* Bark Sunlit Ridge Highlights */}
            <path
              d="M172 700 C 168 640, 176 580, 174 510 C 172 450, 182 390, 186 330"
              stroke="#7A5636"
              strokeWidth="1.8"
              opacity="0.6"
            />

            {/* Lower Secondary Branch (Left) with Swollen Collar */}
            <g className="branch-lower-left">
              <path
                d="M152 460 C 120 445, 80 430, 40 405 C 20 392, 5 385, -10 380 L -10 372 C 8 376, 24 384, 46 397 C 84 420, 124 435, 156 448 Z"
                fill="url(#t1BarkBase)"
              />
              <path d="M38 404 C 18 385, 0 375, -15 368 L -13 363 C 2 370, 20 380, 41 398 Z" fill="url(#t1BarkBase)" />
            </g>

            {/* MAIN PERCHING BRANCH SYSTEM (Biological Multi-Tier Limb for Bird 0) */}
            <g className="tree-perch-branch branch-left">
              {/* Primary Heavy Limb */}
              <path
                d="M178 395 C 220 390, 275 380, 330 368 C 380 358, 425 350, 470 340 L 470 332 C 425 342, 380 350, 330 360 C 275 372, 220 382, 178 386 Z"
                fill="url(#t1BarkBase)"
              />
              {/* Swollen Collar at Junction */}
              <path d="M172 404 C 182 396, 184 382, 178 374" stroke="#160E08" strokeWidth="2.4" fill="none" opacity="0.8" />

              {/* Secondary Lateral Bough */}
              <path
                d="M270 379 C 300 360, 330 345, 360 335 C 385 326, 405 320, 425 316 L 424 311 C 404 315, 383 322, 358 330 C 328 340, 298 355, 268 373 Z"
                fill="url(#t1BarkBase)"
              />
              {/* Tertiary Twig Offshoots & Dead Twig End */}
              <path d="M350 334 C 368 318, 382 308, 395 300 L 397 297 C 384 305, 370 314, 352 330 Z" fill="url(#t1BarkBase)" />
              <path d="M420 351 L 438 342 M 438 342 L 448 335 M 438 342 L 444 348" stroke="#3A2618" strokeWidth="1.2" strokeLinecap="round" />
            </g>

            {/* Upper Crown Branching Skeleton */}
            <path
              d="M195 240 C 170 190, 140 140, 105 90 L 112 86 C 146 135, 176 185, 202 235 Z"
              fill="url(#t1BarkBase)"
            />
            <path
              d="M205 200 C 240 160, 280 120, 320 80 L 326 84 C 286 124, 246 164, 211 204 Z"
              fill="url(#t1BarkBase)"
            />

            {/* Layered Foliage Canopy with Sky Gaps (Shadow -> Mid -> Sunlit Edges) */}
            <g className="tree-foliage">
              {/* Background Shadow Leaves */}
              <ellipse cx="190" cy="120" rx="95" ry="60" fill="url(#t1FoliageShadow)" className="leaf-cluster cluster-sway-1" />
              <ellipse cx="140" cy="160" rx="80" ry="52" fill="url(#t1FoliageShadow)" className="leaf-cluster cluster-sway-2" />
              <ellipse cx="260" cy="140" rx="85" ry="55" fill="url(#t1FoliageShadow)" className="leaf-cluster cluster-sway-3" />

              {/* Midground Leaf Clusters */}
              <ellipse cx="110" cy="180" rx="75" ry="50" fill="url(#t1FoliageMid)" className="leaf-cluster cluster-sway-2" />
              <ellipse cx="220" cy="110" rx="90" ry="58" fill="url(#t1FoliageMid)" className="leaf-cluster cluster-sway-1" />
              <ellipse cx="300" cy="150" rx="80" ry="52" fill="url(#t1FoliageMid)" className="leaf-cluster cluster-sway-3" />
              <ellipse cx="60" cy="380" rx="65" ry="42" fill="url(#t1FoliageMid)" className="leaf-cluster cluster-sway-1" />

              {/* Foreground Sunlit Leaves & Canopy Sky Holes */}
              <ellipse cx="160" cy="130" rx="70" ry="46" fill="url(#t1FoliageSun)" className="leaf-cluster cluster-sway-3" />
              <ellipse cx="250" cy="95" rx="75" ry="48" fill="url(#t1FoliageSun)" className="leaf-cluster cluster-sway-2" />
              <ellipse cx="330" cy="135" rx="68" ry="44" fill="url(#t1FoliageSun)" className="leaf-cluster cluster-sway-1" />
              <ellipse cx="340" cy="330" rx="52" ry="34" fill="url(#t1FoliageSun)" className="leaf-cluster cluster-sway-2" />
              <ellipse cx="430" cy="315" rx="46" ry="30" fill="url(#t1FoliageSun)" className="leaf-cluster cluster-sway-3" />

              {/* Individual Foliage Leaf Tufts (Irregular Canopy Silhouettes) */}
              <circle cx="95" cy="135" r="24" fill="url(#t1FoliageSun)" />
              <circle cx="280" cy="75" r="28" fill="url(#t1FoliageSun)" />
              <circle cx="370" cy="120" r="26" fill="url(#t1FoliageSun)" />
              <circle cx="460" cy="305" r="20" fill="url(#t1FoliageSun)" />
            </g>
          </svg>
        </div>

        {/* TREE 1: CENTER TREE (Tall Mature Forest Tree in Midground) */}
        <div className={`forest-tree-container tree-center-container ${bouncingTrees[1] ? 'branch-bounce-active' : ''}`}>
          <svg className="tree-svg tree-center-svg" viewBox="0 0 620 850" fill="none" preserveAspectRatio="xMidYMax meet">
            <defs>
              <linearGradient id="t2BarkBase" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#181410" />
                <stop offset="30%" stopColor="#2E2822" />
                <stop offset="65%" stopColor="#443D34" />
                <stop offset="85%" stopColor="#322C24" />
                <stop offset="100%" stopColor="#1A1510" />
              </linearGradient>

              <radialGradient id="t2FoliageShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2C3D18" />
                <stop offset="70%" stopColor="#1C280E" />
                <stop offset="100%" stopColor="#0E1606" />
              </radialGradient>
              <radialGradient id="t2FoliageMid" cx="45%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#587630" />
                <stop offset="65%" stopColor="#3B521E" />
                <stop offset="100%" stopColor="#22320E" />
              </radialGradient>
              <radialGradient id="t2FoliageSun" cx="40%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#9AB858" />
                <stop offset="55%" stopColor="#6C8C36" />
                <stop offset="100%" stopColor="#3E561C" />
              </radialGradient>
            </defs>

            {/* Powerful Columnar Trunk with Natural Taper */}
            <path
              d="M275 850 C 280 730, 285 620, 290 500 C 295 400, 290 310, 295 200 L 312 200 C 308 310, 314 400, 310 500 C 315 620, 325 730, 340 850 Z"
              fill="url(#t2BarkBase)"
            />

            {/* Root Flare & Forest Soil */}
            <path d="M275 850 C 285 825, 295 800, 292 750 L 285 752 C 288 798, 278 822, 275 850 Z" fill="#14100C" />
            <path d="M340 850 C 330 825, 320 800, 322 750 L 329 752 C 326 798, 336 822, 340 850 Z" fill="#14100C" />

            {/* Deep Vertical Bark Fissures & Moss Streaks */}
            <g className="bark-fissures-t2" stroke="#120E0A" strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
              <path d="M294 760 C 296 680, 293 600, 297 510 C 295 430, 298 350, 299 260" />
              <path d="M304 780 C 302 700, 306 620, 303 530 C 305 450, 302 360, 305 270" />
              <path d="M312 750 C 310 670, 314 590, 311 500 C 313 420, 309 340, 311 250" />
              {/* Moss Patch on shaded side */}
              <ellipse cx="292" cy="580" rx="3.5" ry="14" fill="#3D4A22" opacity="0.6" />
            </g>

            {/* MAIN PERCHING LIMB FOR BIRD 1 (Left-Center Lateral Branch) */}
            <g className="tree-perch-branch branch-center">
              <path
                d="M294 415 C 240 408, 185 394, 130 382 C 95 374, 65 368, 35 358 L 35 350 C 65 360, 95 366, 130 374 C 185 386, 240 400, 294 406 Z"
                fill="url(#t2BarkBase)"
              />
              {/* Branch Collar */}
              <path d="M290 422 C 298 416, 299 405, 294 398" stroke="#14100C" strokeWidth="2.2" fill="none" />

              {/* Secondary Fork */}
              <path
                d="M195 393 C 170 376, 145 364, 120 354 L 122 349 C 147 359, 172 371, 197 388 Z"
                fill="url(#t2BarkBase)"
              />
              <path d="M100 373 L 82 362 M 82 362 L 70 354 M 82 362 L 76 368" stroke="#281C12" strokeWidth="1.2" strokeLinecap="round" />
            </g>

            {/* Right Spreading Limb */}
            <path
              d="M310 380 C 365 362, 420 340, 480 312 L 483 305 C 423 333, 368 355, 310 372 Z"
              fill="url(#t2BarkBase)"
            />

            {/* Upper High Crown Branches */}
            <path d="M298 250 C 265 190, 225 140, 180 85 L 186 80 C 231 135, 271 185, 304 245 Z" fill="url(#t2BarkBase)" />
            <path d="M308 230 C 345 175, 390 125, 440 75 L 446 80 C 396 130, 351 180, 314 235 Z" fill="url(#t2BarkBase)" />

            {/* High Mature Canopy Foliage */}
            <g className="tree-foliage">
              {/* Background Shadows */}
              <ellipse cx="305" cy="140" rx="115" ry="72" fill="url(#t2FoliageShadow)" className="leaf-cluster cluster-sway-2" />
              <ellipse cx="210" cy="180" rx="90" ry="58" fill="url(#t2FoliageShadow)" className="leaf-cluster cluster-sway-1" />
              <ellipse cx="400" cy="170" rx="95" ry="60" fill="url(#t2FoliageShadow)" className="leaf-cluster cluster-sway-3" />

              {/* Midground Canopy */}
              <ellipse cx="300" cy="115" rx="100" ry="62" fill="url(#t2FoliageMid)" className="leaf-cluster cluster-sway-1" />
              <ellipse cx="170" cy="160" rx="85" ry="54" fill="url(#t2FoliageMid)" className="leaf-cluster cluster-sway-3" />
              <ellipse cx="430" cy="150" rx="90" ry="56" fill="url(#t2FoliageMid)" className="leaf-cluster cluster-sway-2" />
              <ellipse cx="90" cy="360" rx="65" ry="42" fill="url(#t2FoliageMid)" className="leaf-cluster cluster-sway-1" />

              {/* Sunlit Canopy Highlights */}
              <ellipse cx="290" cy="90" rx="85" ry="52" fill="url(#t2FoliageSun)" className="leaf-cluster cluster-sway-3" />
              <ellipse cx="230" cy="130" rx="75" ry="48" fill="url(#t2FoliageSun)" className="leaf-cluster cluster-sway-2" />
              <ellipse cx="380" cy="120" rx="80" ry="50" fill="url(#t2FoliageSun)" className="leaf-cluster cluster-sway-1" />
              <ellipse cx="480" cy="295" rx="60" ry="38" fill="url(#t2FoliageSun)" className="leaf-cluster cluster-sway-3" />

              {/* Natural Leaf Silhouettes */}
              <circle cx="160" cy="125" r="26" fill="url(#t2FoliageSun)" />
              <circle cx="310" cy="65" r="30" fill="url(#t2FoliageSun)" />
              <circle cx="450" cy="110" r="28" fill="url(#t2FoliageSun)" />
            </g>
          </svg>
        </div>

        {/* TREE 2: RIGHT TREE (Older Asymmetrical Leaning Tree) */}
        <div className={`forest-tree-container tree-right-container ${bouncingTrees[2] ? 'branch-bounce-active' : ''}`}>
          <svg className="tree-svg tree-right-svg" viewBox="0 0 640 880" fill="none" preserveAspectRatio="xMidYMax meet">
            <defs>
              <linearGradient id="t3BarkBase" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1E140C" />
                <stop offset="35%" stopColor="#3C2A1B" />
                <stop offset="65%" stopColor="#563D28" />
                <stop offset="85%" stopColor="#422D1C" />
                <stop offset="100%" stopColor="#24170E" />
              </linearGradient>

              <radialGradient id="t3FoliageShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#32441A" />
                <stop offset="70%" stopColor="#202D0E" />
                <stop offset="100%" stopColor="#101806" />
              </radialGradient>
              <radialGradient id="t3FoliageMid" cx="45%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#628236" />
                <stop offset="65%" stopColor="#435D22" />
                <stop offset="100%" stopColor="#263712" />
              </radialGradient>
              <radialGradient id="t3FoliageSun" cx="40%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#A4C462" />
                <stop offset="55%" stopColor="#75963E" />
                <stop offset="100%" stopColor="#425C1E" />
              </radialGradient>
            </defs>

            {/* Asymmetrical Leaning Trunk with Knots and Swells */}
            <path
              d="M440 880 C 420 750, 400 630, 390 510 C 380 390, 390 300, 365 190 L 382 190 C 407 300, 398 390, 408 510 C 420 630, 448 750, 480 880 Z"
              fill="url(#t3BarkBase)"
            />

            {/* Buttress Root Anchors */}
            <path d="M440 880 C 430 845, 415 815, 395 765 L 402 762 C 422 812, 436 842, 440 880 Z" fill="#180F08" />
            <path d="M480 880 C 495 848, 515 820, 535 770 L 542 773 C 522 823, 502 851, 480 880 Z" fill="#180F08" />

            {/* Bark Fissures, Knots & Wood Scars */}
            <g className="bark-fissures-t3" stroke="#160E08" strokeWidth="1.6" strokeLinecap="round" opacity="0.75">
              <path d="M410 780 C 402 690, 405 600, 398 500 C 392 410, 396 320, 385 230" />
              <path d="M425 790 C 418 710, 419 620, 412 520 C 406 430, 410 340, 398 250" />
              <path d="M445 800 C 438 720, 434 640, 426 550" />
              {/* Broken Limb Scar */}
              <ellipse cx="406" cy="450" rx="7" ry="12" fill="#100A05" />
              <path d="M398 440 C 398 452, 400 466, 405 476" stroke="#563D28" strokeWidth="1.4" />
            </g>

            {/* MAIN LATERAL PERCHING LIMB FOR BIRD 2 (Sweeps toward center-right sky) */}
            <g className="tree-perch-branch branch-right">
              {/* Heavy Primary Branch */}
              <path
                d="M392 440 C 320 432, 245 418, 175 404 C 130 396, 90 390, 50 380 L 50 372 C 90 382, 130 388, 175 396 C 245 410, 320 424, 392 430 Z"
                fill="url(#t3BarkBase)"
              />
              {/* Branch Collar */}
              <path d="M398 448 C 390 442, 388 428, 394 420" stroke="#140E08" strokeWidth="2.4" fill="none" />

              {/* Secondary Branch Bough */}
              <path
                d="M245 418 C 215 398, 185 384, 155 374 L 157 369 C 187 379, 217 393, 247 413 Z"
                fill="url(#t3BarkBase)"
              />
              {/* Dead Twig Spur & Live Twig Offshoots */}
              <path d="M125 394 L 105 382 M 105 382 L 92 372 M 105 382 L 100 390" stroke="#3A2516" strokeWidth="1.4" strokeLinecap="round" />
            </g>

            {/* Upper Right Heavy Crown Branch */}
            <path
              d="M380 300 C 435 270, 490 235, 545 195 L 550 188 C 495 228, 440 263, 384 293 Z"
              fill="url(#t3BarkBase)"
            />

            {/* Upper Left Branch */}
            <path d="M370 230 C 330 175, 285 125, 235 75 L 241 70 C 291 120, 336 170, 376 225 Z" fill="url(#t3BarkBase)" />

            {/* Asymmetrical Rich Foliage Canopy */}
            <g className="tree-foliage">
              {/* Deep Shadows */}
              <ellipse cx="360" cy="160" rx="110" ry="70" fill="url(#t3FoliageShadow)" className="leaf-cluster cluster-sway-3" />
              <ellipse cx="280" cy="200" rx="90" ry="58" fill="url(#t3FoliageShadow)" className="leaf-cluster cluster-sway-1" />
              <ellipse cx="470" cy="180" rx="95" ry="60" fill="url(#t3FoliageShadow)" className="leaf-cluster cluster-sway-2" />

              {/* Midground Leaf Layers */}
              <ellipse cx="350" cy="130" rx="95" ry="60" fill="url(#t3FoliageMid)" className="leaf-cluster cluster-sway-2" />
              <ellipse cx="240" cy="180" rx="80" ry="52" fill="url(#t3FoliageMid)" className="leaf-cluster cluster-sway-3" />
              <ellipse cx="490" cy="160" rx="88" ry="55" fill="url(#t3FoliageMid)" className="leaf-cluster cluster-sway-1" />
              <ellipse cx="130" cy="385" rx="65" ry="42" fill="url(#t3FoliageMid)" className="leaf-cluster cluster-sway-3" />

              {/* Sunlit Canopy Highlights & Edge Tufts */}
              <ellipse cx="330" cy="100" rx="80" ry="50" fill="url(#t3FoliageSun)" className="leaf-cluster cluster-sway-1" />
              <ellipse cx="420" cy="125" rx="85" ry="54" fill="url(#t3FoliageSun)" className="leaf-cluster cluster-sway-2" />
              <ellipse cx="530" cy="165" rx="70" ry="44" fill="url(#t3FoliageSun)" className="leaf-cluster cluster-sway-3" />
              <ellipse cx="210" cy="375" rx="55" ry="35" fill="url(#t3FoliageSun)" className="leaf-cluster cluster-sway-1" />

              {/* Detailed Leaf Clusters */}
              <circle cx="215" cy="140" r="28" fill="url(#t3FoliageSun)" />
              <circle cx="360" cy="75" r="32" fill="url(#t3FoliageSun)" />
              <circle cx="510" cy="120" r="28" fill="url(#t3FoliageSun)" />
              <circle cx="85" cy="370" r="24" fill="url(#t3FoliageSun)" />
            </g>
          </svg>
        </div>

        {/* 6. Forest Floor Soil Contours & Leaf Detritus */}
        <div className="forest-floor-terrain">
          <svg className="forest-floor-svg" viewBox="0 0 1600 80" fill="none" preserveAspectRatio="none">
            <path
              d="M0 45 C 220 30, 480 50, 720 35 C 980 20, 1280 40, 1600 25 L 1600 80 L 0 80 Z"
              fill="url(#forestFloorGrad)"
            />
            <defs>
              <linearGradient id="forestFloorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2C1E14" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#1A110B" stopOpacity="0.98" />
                <stop offset="100%" stopColor="#100A06" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 7. Wind Motes & Floating Forest Spores */}
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
