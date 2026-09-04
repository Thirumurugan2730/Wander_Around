import React from 'react';
import NostalgicSun from './NostalgicSun';

/**
 * ForestScene Component
 * Renders the realistic, cinematic golden-hour forest with THREE trees directly matching
 * the provided reference artwork:
 * 
 * 1. Tree 0 (Left): Direct realization of the reference tree with its thick twisted muscular trunk,
 *    spiraling grain contours, central dark trunk hollow, spreading boughs, low perching branch,
 *    lush scalloped umbrella dome canopy, and mossy ground foliage mound.
 * 2. Tree 1 (Center): Botanically matching taller mature tree in the same twisted style with
 *    spreading crown, sinuous trunk grain, and center perching branch.
 * 3. Tree 2 (Right): Botanically matching asymmetrical mature tree with gnarled twisted limbs
 *    reaching toward the center-right sky and lush scalloped canopy.
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
          <path
            d="M0 320 Q 300 210, 620 280 T 1180 230 T 1600 300 L 1600 450 L 0 450 Z"
            fill="url(#deepHillGrad)"
            opacity="0.45"
          />
          <path
            d="M0 360 Q 340 270, 750 330 T 1360 290 T 1600 350 L 1600 450 L 0 450 Z"
            fill="url(#midHillGrad)"
            opacity="0.75"
          />
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
           5. THREE TREES EXACTLY MATCHING THE REFERENCE ARTWORK STYLE
           ========================================================================== */}

        {/* TREE 0: LEFT TREE (Direct recreation of Reference Tree with Twisted Trunk & Scalloped Canopy) */}
        <div className={`forest-tree-container tree-left-container ${bouncingTrees[0] ? 'branch-bounce-active' : ''}`}>
          <svg className="tree-svg tree-left-svg" viewBox="0 0 520 620" fill="none" preserveAspectRatio="xMidYMax meet">
            <defs>
              {/* Reference Wood Bark Gradients (Twisted Sinuous Fibers) */}
              <linearGradient id="refBarkShadow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1E1510" />
                <stop offset="50%" stopColor="#362418" />
                <stop offset="100%" stopColor="#22170F" />
              </linearGradient>
              <linearGradient id="refBarkMid" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3A281C" />
                <stop offset="50%" stopColor="#5B402B" />
                <stop offset="100%" stopColor="#452F1E" />
              </linearGradient>
              <linearGradient id="refBarkSunlit" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6E4D33" />
                <stop offset="50%" stopColor="#9C734D" />
                <stop offset="100%" stopColor="#B88A5E" />
              </linearGradient>

              {/* Reference Canopy Gradients: 3-Tier Shading */}
              <radialGradient id="refCanopySunlit" cx="50%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#C4E674" />
                <stop offset="35%" stopColor="#A0CB4E" />
                <stop offset="70%" stopColor="#7DAA36" />
                <stop offset="100%" stopColor="#567E22" />
              </radialGradient>
              <radialGradient id="refCanopyMid" cx="45%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#6C9738" />
                <stop offset="50%" stopColor="#4A7123" />
                <stop offset="85%" stopColor="#304F14" />
                <stop offset="100%" stopColor="#1C330B" />
              </radialGradient>
              <radialGradient id="refCanopyShadow" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#284214" />
                <stop offset="60%" stopColor="#17290B" />
                <stop offset="100%" stopColor="#0B1505" />
              </radialGradient>
            </defs>

            {/* 1. Base Ground Foliage Mound & Mossy Stones (from Reference Base) */}
            <g className="tree-ground-mound">
              {/* Mossy Stones */}
              <ellipse cx="320" cy="570" rx="35" ry="18" fill="#383C2A" />
              <ellipse cx="345" cy="580" rx="28" ry="14" fill="#4B4E38" />
              <ellipse cx="180" cy="575" rx="32" ry="16" fill="#383C2A" />

              {/* Broad Leaf Forest Plants at Base */}
              <path d="M190 570 C 160 550, 140 520, 145 490 C 165 510, 190 540, 205 565 Z" fill="#3D6426" />
              <path d="M175 580 C 145 565, 120 545, 125 520 C 145 535, 175 560, 190 575 Z" fill="#588537" />
              <path d="M210 575 C 190 545, 185 515, 195 485 C 215 510, 225 545, 225 570 Z" fill="#75A648" />

              <path d="M300 570 C 330 550, 355 525, 360 495 C 340 515, 315 545, 295 565 Z" fill="#3D6426" />
              <path d="M320 578 C 350 560, 380 540, 375 515 C 355 535, 325 560, 305 575 Z" fill="#588537" />
              <path d="M285 580 C 305 550, 315 520, 310 490 C 290 515, 280 550, 275 575 Z" fill="#75A648" />

              {/* Grass Tufts & Detritus */}
              <path d="M240 590 L 235 560 L 245 565 L 248 550 L 255 568 L 260 555 L 265 590 Z" fill="#4D762D" />
            </g>

            {/* 2. THE TWISTED MUSCULAR TRUNK (Exact Sinuous Flow & Central Hollow) */}
            <g className="reference-twisted-trunk">
              {/* Outer Trunk Mass with Spiraling Contours */}
              <path
                d="M205 570 C 195 520, 175 480, 170 440 C 160 380, 200 350, 225 320 C 245 295, 250 260, 255 220 L 285 220 C 290 260, 295 290, 320 320 C 345 350, 365 385, 345 440 C 330 480, 315 520, 305 570 Z"
                fill="url(#refBarkMid)"
              />

              {/* Central Dark Trunk Hollow / Cavity */}
              <path
                d="M235 440 C 225 410, 230 380, 248 350 C 265 380, 270 410, 260 440 C 255 455, 240 455, 235 440 Z"
                fill="#120A05"
              />

              {/* Sinuous Spiraling Muscle Grain Strands (Left Shaded Muscle) */}
              <path
                d="M195 560 C 185 515, 170 475, 168 435 C 165 390, 195 365, 218 335 C 235 310, 242 275, 248 230"
                stroke="#25180F"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M198 555 C 188 510, 174 470, 172 430 C 170 385, 200 360, 222 330 C 238 305, 246 270, 250 225"
                stroke="url(#refBarkMid)"
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Central Twisting Fiber Strand (Wrapping over Hollow) */}
              <path
                d="M225 550 C 220 500, 205 465, 215 425 C 230 375, 255 345, 270 300 C 278 270, 280 245, 282 220"
                stroke="#1E130B"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M226 548 C 222 498, 208 462, 218 422 C 232 372, 258 342, 272 298 C 280 268, 282 242, 284 220"
                stroke="url(#refBarkSunlit)"
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Sunlit Right Muscle Strands (Warm Ochre Highlights) */}
              <path
                d="M275 560 C 285 510, 305 470, 320 430 C 335 385, 325 350, 305 320 C 295 295, 292 265, 295 220"
                stroke="url(#refBarkSunlit)"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M280 555 C 290 505, 310 465, 324 425 C 338 380, 328 345, 308 315 C 298 290, 296 260, 298 220"
                stroke="#D4A373"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.85"
              />

              {/* Low Horizontal Twisted Branch (Left Landing Perch for Bird 0) */}
              <g className="tree-perch-branch branch-left">
                <path
                  d="M175 435 C 145 430, 115 420, 85 410 C 65 402, 45 398, 25 390 L 25 382 C 45 390, 65 394, 85 402 C 115 412, 145 422, 175 426 Z"
                  fill="url(#refBarkMid)"
                />
                <path
                  d="M172 432 C 144 427, 114 417, 84 407 C 64 399, 44 395, 25 387"
                  stroke="url(#refBarkSunlit)"
                  strokeWidth="2.2"
                  fill="none"
                />
                {/* Secondary Twig Fork */}
                <path d="M95 415 C 80 402, 68 392, 55 385 L 57 381 C 70 388, 82 398, 97 411 Z" fill="url(#refBarkMid)" />
              </g>

              {/* Low Right Branch Sprig with Fresh Green Leaves */}
              <g className="branch-lower-right-sprig">
                <path d="M335 430 C 360 420, 385 405, 410 385 L 414 390 C 389 410, 363 426, 337 436 Z" fill="url(#refBarkMid)" />
                {/* Sprouting Green Leaves on Right Limb */}
                <circle cx="410" cy="380" r="14" fill="#95C448" />
                <circle cx="425" cy="375" r="16" fill="#B2DB5E" />
                <circle cx="395" cy="390" r="12" fill="#71A032" />
                <circle cx="435" cy="390" r="11" fill="#95C448" />
              </g>

              {/* Spreading Fan Boughs into Under-Canopy */}
              <path d="M235 300 C 190 260, 145 220, 105 180 L 115 174 C 153 212, 196 252, 241 292 Z" fill="url(#refBarkShadow)" />
              <path d="M255 250 C 230 195, 205 140, 185 80 L 195 78 C 214 136, 238 190, 263 244 Z" fill="url(#refBarkShadow)" />
              <path d="M285 240 C 320 185, 360 135, 405 85 L 413 92 C 370 140, 331 189, 296 244 Z" fill="url(#refBarkShadow)" />
              <path d="M305 285 C 355 250, 405 210, 450 165 L 458 172 C 412 216, 363 255, 314 290 Z" fill="url(#refBarkShadow)" />
            </g>

            {/* 3. LUSH SCALLOPED UMBRELLA DOME CANOPY (Reference Multi-Tier Shading) */}
            <g className="reference-scalloped-canopy">
              {/* Layer A: Deep Under-Canopy Shadow Dome */}
              <g className="canopy-shadow-layer">
                <ellipse cx="270" cy="200" rx="200" ry="120" fill="url(#refCanopyShadow)" className="leaf-cluster cluster-sway-1" />
                <ellipse cx="180" cy="220" rx="140" ry="90" fill="url(#refCanopyShadow)" className="leaf-cluster cluster-sway-2" />
                <ellipse cx="360" cy="220" rx="140" ry="90" fill="url(#refCanopyShadow)" className="leaf-cluster cluster-sway-3" />
              </g>

              {/* Layer B: Mid-Tone Emerald Leaf Scallops */}
              <g className="canopy-mid-layer">
                {/* Scalloped perimeter leaf bumps */}
                <circle cx="120" cy="240" r="48" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-2" />
                <circle cx="85" cy="200" r="42" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-1" />
                <circle cx="95" cy="150" r="45" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-3" />
                <circle cx="130" cy="110" r="50" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-2" />
                <circle cx="180" cy="80" r="56" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-1" />
                <circle cx="240" cy="65" r="62" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-3" />
                <circle cx="300" cy="65" r="62" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-2" />
                <circle cx="360" cy="80" r="56" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-1" />
                <circle cx="410" cy="110" r="50" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-3" />
                <circle cx="445" cy="150" r="45" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-2" />
                <circle cx="455" cy="200" r="42" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-1" />
                <circle cx="420" cy="240" r="48" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-3" />
                {/* Central body mass */}
                <ellipse cx="270" cy="160" rx="170" ry="95" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-1" />
              </g>

              {/* Layer C: Sunlit Golden Lime-Green Leaf Clusters (Top Highlights) */}
              <g className="canopy-sunlit-layer">
                <circle cx="160" cy="120" r="42" fill="url(#refCanopySunlit)" className="leaf-cluster cluster-sway-3" />
                <circle cx="210" cy="90" r="48" fill="url(#refCanopySunlit)" className="leaf-cluster cluster-sway-2" />
                <circle cx="270" cy="75" r="54" fill="url(#refCanopySunlit)" className="leaf-cluster cluster-sway-1" />
                <circle cx="330" cy="90" r="48" fill="url(#refCanopySunlit)" className="leaf-cluster cluster-sway-3" />
                <circle cx="380" cy="120" r="42" fill="url(#refCanopySunlit)" className="leaf-cluster cluster-sway-2" />
                <circle cx="270" cy="125" r="52" fill="url(#refCanopySunlit)" className="leaf-cluster cluster-sway-1" />
                <circle cx="210" cy="150" r="44" fill="url(#refCanopySunlit)" className="leaf-cluster cluster-sway-3" />
                <circle cx="330" cy="150" r="44" fill="url(#refCanopySunlit)" className="leaf-cluster cluster-sway-2" />
                {/* Fine leaf scallop edge frills */}
                <circle cx="190" cy="65" r="22" fill="#D4F282" />
                <circle cx="245" cy="48" r="26" fill="#D4F282" />
                <circle cx="295" cy="48" r="26" fill="#D4F282" />
                <circle cx="350" cy="65" r="22" fill="#D4F282" />
                <circle cx="140" cy="95" r="20" fill="#BFE86C" />
                <circle cx="400" cy="95" r="20" fill="#BFE86C" />
              </g>
            </g>
          </svg>
        </div>

        {/* TREE 1: CENTER TREE (Taller Mature Tree in Matching Twisted Botanical Style) */}
        <div className={`forest-tree-container tree-center-container ${bouncingTrees[1] ? 'branch-bounce-active' : ''}`}>
          <svg className="tree-svg tree-center-svg" viewBox="0 0 540 640" fill="none" preserveAspectRatio="xMidYMax meet">
            <defs>
              <linearGradient id="t2RefBarkMid" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2E2016" />
                <stop offset="50%" stopColor="#4E3725" />
                <stop offset="100%" stopColor="#3A281A" />
              </linearGradient>
              <linearGradient id="t2RefBarkSun" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#62432B" />
                <stop offset="50%" stopColor="#8F6844" />
                <stop offset="100%" stopColor="#AD8055" />
              </linearGradient>
            </defs>

            {/* Base Foliage & Stones */}
            <g className="tree-ground-mound">
              <ellipse cx="270" cy="590" rx="40" ry="18" fill="#383C2A" />
              <path d="M220 590 C 200 565, 195 535, 205 505 C 225 530, 235 565, 245 585 Z" fill="#46702D" />
              <path d="M310 590 C 330 565, 335 535, 325 505 C 305 530, 295 565, 285 585 Z" fill="#46702D" />
            </g>

            {/* Twisted Muscular Columnar Trunk */}
            <g className="reference-twisted-trunk">
              <path
                d="M230 590 C 220 535, 210 475, 215 425 C 225 365, 245 325, 255 275 L 285 275 C 295 325, 315 365, 325 425 C 330 475, 320 535, 310 590 Z"
                fill="url(#t2RefBarkMid)"
              />
              {/* Central Trunk Crevice */}
              <path d="M260 460 C 252 425, 256 390, 270 360 C 284 390, 288 425, 280 460 Z" fill="#140B06" />

              {/* Sinuous Grain Contours */}
              <path d="M228 580 C 218 525, 210 470, 222 415 C 238 355, 260 315, 268 275" stroke="#1E140C" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M245 570 C 240 510, 235 450, 250 400 C 265 350, 275 310, 278 275" stroke="url(#t2RefBarkSun)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M290 575 C 298 520, 312 465, 318 410 C 310 360, 295 320, 286 275" stroke="url(#t2RefBarkSun)" strokeWidth="6" strokeLinecap="round" fill="none" />

              {/* Main Center Landing Perch Branch for Bird 1 (Reaches left-center) */}
              <g className="tree-perch-branch branch-center">
                <path
                  d="M225 420 C 185 412, 145 398, 105 385 C 80 376, 55 370, 30 360 L 30 352 C 55 362, 80 368, 105 376 C 145 390, 185 404, 225 410 Z"
                  fill="url(#t2RefBarkMid)"
                />
                <path d="M222 416 C 184 408, 144 394, 104 382 C 79 374, 54 368, 30 357" stroke="url(#t2RefBarkSun)" strokeWidth="2" fill="none" />
              </g>

              {/* Spreading Crown Boughs */}
              <path d="M250 290 C 210 245, 170 200, 130 150 L 138 144 C 177 193, 216 237, 257 282 Z" fill="#180F08" />
              <path d="M290 285 C 330 240, 370 195, 410 145 L 418 151 C 379 200, 338 244, 297 289 Z" fill="#180F08" />
            </g>

            {/* Scalloped Taller Umbrella Canopy */}
            <g className="reference-scalloped-canopy">
              {/* Shadow Base */}
              <ellipse cx="270" cy="180" rx="190" ry="110" fill="url(#refCanopyShadow)" className="leaf-cluster cluster-sway-2" />
              {/* Mid Layer */}
              <circle cx="120" cy="210" r="44" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-1" />
              <circle cx="95" cy="165" r="40" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-3" />
              <circle cx="130" cy="115" r="48" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-2" />
              <circle cx="185" cy="80" r="54" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-1" />
              <circle cx="270" cy="60" r="60" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-3" />
              <circle cx="355" cy="80" r="54" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-2" />
              <circle cx="410" cy="115" r="48" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-1" />
              <circle cx="445" cy="165" r="40" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-3" />
              <circle cx="420" cy="210" r="44" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-2" />
              {/* Sunlit Highlights */}
              <circle cx="210" cy="95" r="45" fill="url(#refCanopySunlit)" className="leaf-cluster cluster-sway-1" />
              <circle cx="270" cy="80" r="50" fill="url(#refCanopySunlit)" className="leaf-cluster cluster-sway-3" />
              <circle cx="330" cy="95" r="45" fill="url(#refCanopySunlit)" className="leaf-cluster cluster-sway-2" />
              <circle cx="270" cy="130" r="48" fill="url(#refCanopySunlit)" className="leaf-cluster cluster-sway-1" />
              {/* Scallop frills */}
              <circle cx="240" cy="45" r="24" fill="#D4F282" />
              <circle cx="300" cy="45" r="24" fill="#D4F282" />
            </g>
          </svg>
        </div>

        {/* TREE 2: RIGHT TREE (Asymmetrical Mature Tree in Matching Twisted Botanical Style) */}
        <div className={`forest-tree-container tree-right-container ${bouncingTrees[2] ? 'branch-bounce-active' : ''}`}>
          <svg className="tree-svg tree-right-svg" viewBox="0 0 540 640" fill="none" preserveAspectRatio="xMidYMax meet">
            <defs>
              <linearGradient id="t3RefBarkMid" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#322216" />
                <stop offset="50%" stopColor="#543A24" />
                <stop offset="100%" stopColor="#3E2A1A" />
              </linearGradient>
              <linearGradient id="t3RefBarkSun" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6E4D30" />
                <stop offset="50%" stopColor="#A3784F" />
                <stop offset="100%" stopColor="#C49364" />
              </linearGradient>
            </defs>

            {/* Base Foliage & Stones */}
            <g className="tree-ground-mound">
              <ellipse cx="300" cy="590" rx="42" ry="18" fill="#383C2A" />
              <path d="M250 590 C 230 565, 225 535, 235 505 C 255 530, 265 565, 275 585 Z" fill="#46702D" />
              <path d="M340 590 C 360 565, 365 535, 355 505 C 335 530, 325 565, 315 585 Z" fill="#46702D" />
            </g>

            {/* Asymmetrical Twisted Trunk */}
            <g className="reference-twisted-trunk">
              <path
                d="M320 590 C 335 535, 350 475, 345 425 C 335 365, 305 325, 290 275 L 260 275 C 250 325, 235 365, 230 425 C 225 475, 240 535, 255 590 Z"
                fill="url(#t3RefBarkMid)"
              />
              {/* Central Trunk Crevice */}
              <path d="M275 450 C 265 415, 270 380, 285 350 C 300 380, 305 415, 295 450 Z" fill="#120A05" />

              {/* Sinuous Spiraling Strands */}
              <path d="M315 580 C 328 525, 342 470, 332 415 C 318 355, 292 315, 280 275" stroke="url(#t3RefBarkSun)" strokeWidth="8" strokeLinecap="round" fill="none" />
              <path d="M260 575 C 248 520, 236 465, 242 410 C 254 360, 272 320, 282 275" stroke="#1E140C" strokeWidth="6" strokeLinecap="round" fill="none" />

              {/* Main Lateral Perching Limb for Bird 2 (Sweeps leftward into center-right sky) */}
              <g className="tree-perch-branch branch-right">
                <path
                  d="M250 425 C 205 416, 160 404, 115 390 C 85 380, 55 372, 25 362 L 25 354 C 55 364, 85 372, 115 382 C 160 396, 205 408, 250 415 Z"
                  fill="url(#t3RefBarkMid)"
                />
                <path d="M246 421 C 203 412, 159 400, 114 386 C 84 376, 54 368, 25 358" stroke="url(#t3RefBarkSun)" strokeWidth="2.2" fill="none" />
                {/* Lateral Twig Fork */}
                <path d="M125 395 C 105 380, 90 368, 75 358 L 77 354 C 92 364, 107 376, 127 391 Z" fill="url(#t3RefBarkMid)" />
              </g>

              {/* Spreading Crown Boughs */}
              <path d="M265 285 C 220 240, 175 195, 130 145 L 138 139 C 182 188, 226 232, 271 277 Z" fill="#180F08" />
              <path d="M295 285 C 340 240, 385 195, 430 145 L 438 151 C 394 200, 350 244, 303 289 Z" fill="#180F08" />
            </g>

            {/* Asymmetrical Umbrella Canopy */}
            <g className="reference-scalloped-canopy">
              {/* Shadow Base */}
              <ellipse cx="280" cy="180" rx="195" ry="115" fill="url(#refCanopyShadow)" className="leaf-cluster cluster-sway-3" />
              {/* Mid Layer Scallops */}
              <circle cx="130" cy="210" r="44" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-2" />
              <circle cx="100" cy="165" r="40" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-1" />
              <circle cx="135" cy="115" r="48" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-3" />
              <circle cx="190" cy="80" r="54" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-2" />
              <circle cx="280" cy="60" r="60" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-1" />
              <circle cx="365" cy="80" r="54" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-3" />
              <circle cx="420" cy="115" r="48" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-2" />
              <circle cx="455" cy="165" r="40" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-1" />
              <circle cx="430" cy="210" r="44" fill="url(#refCanopyMid)" className="leaf-cluster cluster-sway-3" />
              {/* Sunlit Highlights */}
              <circle cx="220" cy="95" r="45" fill="url(#refCanopySunlit)" className="leaf-cluster cluster-sway-3" />
              <circle cx="280" cy="80" r="50" fill="url(#refCanopySunlit)" className="leaf-cluster cluster-sway-1" />
              <circle cx="340" cy="95" r="45" fill="url(#refCanopySunlit)" className="leaf-cluster cluster-sway-2" />
              <circle cx="280" cy="130" r="48" fill="url(#refCanopySunlit)" className="leaf-cluster cluster-sway-3" />
              {/* Scallop frills */}
              <circle cx="250" cy="45" r="24" fill="#D4F282" />
              <circle cx="310" cy="45" r="24" fill="#D4F282" />
            </g>
          </svg>
        </div>

        {/* 6. Wind Motes & Floating Forest Spores */}
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
