import { useMemo } from 'react';

/**
 * Deterministic pseudo-random generator seeded from string/index.
 */
function pseudoRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function stringToSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * 6 Continuous, non-teleporting wind trajectories.
 * Every trajectory is a smooth, continuous closed loop or off-screen wrapped path
 * with zero sudden jumps, zero teleportation, and smooth velocity transitions.
 */
const WIND_TRAJECTORIES = [
  'windDriftHarmonicA', // Sweeping East-Northeast wave loop
  'windDriftHarmonicB', // Wide East-Southeast glide loop
  'windDriftHarmonicC', // Ascending thermal breeze loop
  'windDriftHarmonicD', // Figure-8 lazy air current
  'windDriftHarmonicE', // Deep lazy horizontal current
  'windDriftHarmonicF', // Undulating golden hour air stream
];

const PHOTO_COMPOSITIONS = ['photo-rest', 'photo-hang', 'photo-overlap'];
const TEXT_COMPOSITIONS = ['text-note', 'text-tuck'];

// Sun position reference in the upper-right sky
const SUN_POS = { x: 78, y: 10 };

/**
 * Computes organic sky positions, cloud silhouettes, photo/note compositions,
 * depth levels, sunlight proximity, and continuous wind-drift physics for every moment.
 */
export function useWanderingLayout(posts = []) {
  return useMemo(() => {
    const count = posts.length;
    if (count === 0) return [];

    // Single moment: centered gracefully in the middle sky with wide lazy drift
    if (count === 1) {
      const post = posts[0];
      const hasPhoto = Boolean(post.hasPhoto || post.has_photo || post.imagePath || post.image_path);
      return [{
        post,
        style: {
          left: '50%',
          top: '46%',
          transform: 'translate(-50%, -50%)',
          '--rot-start': '-1.5deg',
          '--rot-delta': '2deg',
          '--wind-drift-x': '65px',
          '--wind-drift-y': '28px',
          '--drift-dur': '38s',
          '--drift-delay': '0s',
          '--cloud-scale': '1.08',
          animationName: 'windDriftHarmonicA',
          animationDuration: '38s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
        },
        cloudVariant: 0,
        compositionType: hasPhoto ? (post.text ? 'photo-text-combo' : 'photo-rest') : 'text-note',
        depthClass: 'depth-near',
        sunlitClass: 'sunlit-warm',
        isProminent: true,
      }];
    }

    // Grid zone partitioning to guarantee wide, balanced dispersion across the sky
    const cols = count <= 3 ? 2 : count <= 8 ? 3 : count <= 15 ? 4 : count <= 24 ? 5 : 6;
    const rows = Math.ceil(count / cols);

    const cellWidth = 86 / cols; // % of canvas width
    const cellHeight = 78 / rows; // % of canvas height

    return posts.map((post, index) => {
      const postKey = String(post.id || index);
      const seed = stringToSeed(postKey) + index * 53;

      const col = index % cols;
      const row = Math.floor(index / cols);

      // Organic jitter inside assigned sky zone
      const jitterX = (pseudoRandom(seed + 1) - 0.5) * (cellWidth * 0.52);
      const jitterY = (pseudoRandom(seed + 2) - 0.5) * (cellHeight * 0.52);

      const baseX = 7 + col * cellWidth + cellWidth / 2 + jitterX;
      const baseY = 8 + row * cellHeight + cellHeight / 2 + jitterY;

      const clampedX = Math.max(5, Math.min(83, baseX));
      const clampedY = Math.max(6, Math.min(82, baseY));

      // Deterministic physical photo tilt: -4.5deg to +4.5deg
      const baseRot = (pseudoRandom(seed + 3) * 8 - 4).toFixed(1);
      const rotDelta = (pseudoRandom(seed + 4) * 2.2 + 1.0).toFixed(1);

      // Depth classification for atmospheric perspective
      const depthVal = pseudoRandom(seed + 5);
      let depthClass = 'depth-mid';
      let scale = 1.0;
      let zIndex = 15;

      if (depthVal < 0.28) {
        depthClass = 'depth-far';
        scale = 0.86;
        zIndex = 5;
      } else if (depthVal > 0.72) {
        depthClass = 'depth-near';
        scale = 1.08;
        zIndex = 22;
      }

      // Proximity to the Sun at (78%, 10%)
      const distToSun = Math.sqrt(
        Math.pow(clampedX - SUN_POS.x, 2) + Math.pow(clampedY - SUN_POS.y, 2)
      );

      let sunlitClass = 'sunlit-neutral';
      if (distToSun < 46) {
        sunlitClass = 'sunlit-warm';
      } else if (distToSun > 74) {
        sunlitClass = 'sunlit-cool';
      }

      // Wind drift translation distance (physical noticeable wandering: 50px to 95px)
      const driftX = (pseudoRandom(seed + 6) * 45 + 50).toFixed(0);
      const driftY = ((pseudoRandom(seed + 7) * 30 + 18) * (pseudoRandom(seed + 8) > 0.45 ? 1 : -1)).toFixed(0);

      // Durations: 36s, 44s, 52s, 62s, 72s, 84s for gentle, realistic wind movement
      const hasPhoto = Boolean(post.hasPhoto || post.has_photo || post.imagePath || post.image_path);
      const baseDurations = hasPhoto ? [45, 54, 64, 75, 86] : [36, 44, 52, 60, 70];
      const driftDur = baseDurations[Math.floor(pseudoRandom(seed + 9) * baseDurations.length)];

      // Negative animation delays: ensures clouds are already in smooth staggered flight upon page load
      const negativeDelay = -(pseudoRandom(seed + 10) * (driftDur * 0.85)).toFixed(1);

      const trajectory = WIND_TRAJECTORIES[index % WIND_TRAJECTORIES.length];
      const cloudVariant = index % 4;

      // Composition assignment
      let compositionType = 'photo-rest';
      if (hasPhoto) {
        if (post.text && post.text.trim().length > 0) {
          compositionType = 'photo-text-combo';
        } else {
          compositionType = PHOTO_COMPOSITIONS[Math.floor(pseudoRandom(seed + 11) * PHOTO_COMPOSITIONS.length)];
        }
      } else {
        compositionType = TEXT_COMPOSITIONS[Math.floor(pseudoRandom(seed + 12) * TEXT_COMPOSITIONS.length)];
      }

      return {
        post,
        style: {
          left: `${clampedX.toFixed(2)}%`,
          top: `${clampedY.toFixed(2)}%`,
          zIndex,
          '--rot-start': `${baseRot}deg`,
          '--rot-delta': `${rotDelta}deg`,
          '--wind-drift-x': `${driftX}px`,
          '--wind-drift-y': `${driftY}px`,
          '--drift-dur': `${driftDur}s`,
          '--drift-delay': `${negativeDelay}s`,
          '--cloud-scale': `${scale}`,
          animationName: trajectory,
          animationDuration: `${driftDur}s`,
          animationDelay: `${negativeDelay}s`,
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
        },
        cloudVariant,
        compositionType,
        depthClass,
        sunlitClass,
        isProminent: count <= 3,
      };
    });
  }, [posts]);
}
