import { useMemo } from 'react';

/**
 * Simple deterministic hash function for generating stable pseudo-random properties
 * based on post ID and index.
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
 * Computes organic, distributed, non-overlapping canvas positions for a list of posts.
 * Generates deterministic coordinates, drift vectors, rotation, duration, and delay.
 */
export function useWanderingLayout(posts = []) {
  return useMemo(() => {
    const count = posts.length;
    if (count === 0) return [];

    // Animation trajectory variants
    const animVariants = ['wanderFloatA', 'wanderFloatB', 'wanderFloatC', 'wanderFloatD'];

    // If only 1 post, center it gracefully
    if (count === 1) {
      const post = posts[0];
      return [{
        post,
        style: {
          left: '50%',
          top: '48%',
          transform: 'translate(-50%, -50%) rotate(-1deg)',
          '--rot-start': '-1deg',
          '--rot-delta': '1.2deg',
          '--drift-x': '12px',
          '--drift-y': '10px',
          '--drift-dur': '18s',
          '--drift-delay': '0s',
          animationName: 'wanderFloatA',
          animationDuration: '18s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
        },
        tint: 'tint-sun',
        isProminent: true,
      }];
    }

    // Determine grid/zone partition parameters based on count
    // We create zones across the canvas (width x height) to guarantee good dispersion
    const cols = count <= 4 ? 2 : count <= 9 ? 3 : count <= 16 ? 4 : 5;
    const rows = Math.ceil(count / cols);

    const cellWidth = 84 / cols; // % of canvas width (leaving margins)
    const cellHeight = 78 / rows; // % of canvas height (leaving header/footer margin)

    const tints = ['tint-sun', 'tint-sky', 'tint-peach', 'tint-sage', 'tint-lavender'];

    // Map each post to a jittered zone
    return posts.map((post, index) => {
      const postKey = String(post.id || index);
      const seed = stringToSeed(postKey) + index * 37;

      const col = index % cols;
      const row = Math.floor(index / cols);

      // Add deterministic jitter within its assigned cell
      const jitterX = (pseudoRandom(seed + 1) - 0.5) * (cellWidth * 0.55);
      const jitterY = (pseudoRandom(seed + 2) - 0.5) * (cellHeight * 0.55);

      // Safe base bounds (left: 6% to 88%, top: 8% to 84%)
      const baseX = 8 + col * cellWidth + cellWidth / 2 + jitterX;
      const baseY = 10 + row * cellHeight + cellHeight / 2 + jitterY;

      const clampedX = Math.max(5, Math.min(85, baseX));
      const clampedY = Math.max(6, Math.min(84, baseY));

      // Deterministic rotation: -4.5deg to +4.5deg
      const baseRot = (pseudoRandom(seed + 3) * 9 - 4.5).toFixed(1);
      const rotDelta = (pseudoRandom(seed + 4) * 1.6 + 0.6).toFixed(1);

      // Drift ranges (calm, subtle, slow)
      const driftX = (pseudoRandom(seed + 5) * 20 - 10).toFixed(0);
      const driftY = (pseudoRandom(seed + 6) * 18 - 9).toFixed(0);
      const driftDur = (14 + pseudoRandom(seed + 7) * 10).toFixed(1); // 14s - 24s
      const driftDelay = (pseudoRandom(seed + 8) * 4).toFixed(1); // 0s - 4s
      const animVariant = animVariants[Math.floor(pseudoRandom(seed + 9) * animVariants.length)];

      const tint = tints[index % tints.length];

      return {
        post,
        style: {
          left: `${clampedX.toFixed(2)}%`,
          top: `${clampedY.toFixed(2)}%`,
          '--rot-start': `${baseRot}deg`,
          '--rot-delta': `${rotDelta}deg`,
          '--drift-x': `${driftX}px`,
          '--drift-y': `${driftY}px`,
          '--drift-dur': `${driftDur}s`,
          '--drift-delay': `${driftDelay}s`,
          animationName: animVariant,
          animationDuration: `${driftDur}s`,
          animationDelay: `${driftDelay}s`,
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
        },
        tint,
        isProminent: count <= 3,
      };
    });
  }, [posts]);
}
