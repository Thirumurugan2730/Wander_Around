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
 * 8 distinct, visible continuous cloud wandering animation trajectories.
 */
const CLOUD_TRAJECTORIES = [
  'cloudDriftLoopA', // left -> up -> right -> down
  'cloudDriftLoopB', // right -> down -> left -> up
  'cloudDriftDiagonal', // diagonal sway
  'cloudDriftWave', // wide horizontal floating wave
  'cloudDriftCircle', // slow circular eddy
  'cloudDriftSway', // gentle vertical floating swing
  'cloudDriftInfinity', // smooth figure-8 drift
  'cloudDriftBreeze', // gentle angled drift
];

const CLOUD_TINTS = [
  'cloud-tint-pure',
  'cloud-tint-sun',
  'cloud-tint-sky',
  'cloud-tint-peach',
  'cloud-tint-lavender',
  'cloud-tint-mint',
];

/**
 * Computes organic, distributed, non-overlapping canvas cloud coordinates for all moments.
 * Generates stable positions, scales, depths, and independent drifting physics.
 */
export function useWanderingLayout(posts = []) {
  return useMemo(() => {
    const count = posts.length;
    if (count === 0) return [];

    // Single moment: centered gracefully in the middle sky
    if (count === 1) {
      const post = posts[0];
      return [{
        post,
        style: {
          left: '50%',
          top: '46%',
          transform: 'translate(-50%, -50%)',
          '--rot-start': '-1.5deg',
          '--rot-delta': '2deg',
          '--drift-x': '28px',
          '--drift-y': '20px',
          '--drift-dur': '20s',
          '--drift-delay': '0s',
          '--cloud-scale': '1.08',
          animationName: 'cloudDriftLoopA',
          animationDuration: '20s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
        },
        tint: 'cloud-tint-sun',
        depthClass: 'cloud-depth-near',
        isProminent: true,
      }];
    }

    // Grid zone partitioning to guarantee even dispersion without clumping
    const cols = count <= 3 ? 2 : count <= 8 ? 3 : count <= 15 ? 4 : count <= 24 ? 5 : 6;
    const rows = Math.ceil(count / cols);

    const cellWidth = 86 / cols; // % of canvas width
    const cellHeight = 80 / rows; // % of canvas height

    return posts.map((post, index) => {
      const postKey = String(post.id || index);
      const seed = stringToSeed(postKey) + index * 43;

      const col = index % cols;
      const row = Math.floor(index / cols);

      // Deterministic organic jitter inside assigned zone
      const jitterX = (pseudoRandom(seed + 1) - 0.5) * (cellWidth * 0.52);
      const jitterY = (pseudoRandom(seed + 2) - 0.5) * (cellHeight * 0.52);

      const baseX = 7 + col * cellWidth + cellWidth / 2 + jitterX;
      const baseY = 8 + row * cellHeight + cellHeight / 2 + jitterY;

      const clampedX = Math.max(4, Math.min(84, baseX));
      const clampedY = Math.max(6, Math.min(82, baseY));

      // Deterministic rotation: -4deg to +4deg
      const baseRot = (pseudoRandom(seed + 3) * 8 - 4).toFixed(1);
      const rotDelta = (pseudoRandom(seed + 4) * 2.2 + 1.0).toFixed(1);

      // Depth classification for natural sky perspective
      const depthVal = pseudoRandom(seed + 5);
      let depthClass = 'cloud-depth-mid';
      let scale = 1.0;
      let zIndex = 15;

      if (depthVal < 0.28) {
        depthClass = 'cloud-depth-far';
        scale = 0.88;
        zIndex = 5;
      } else if (depthVal > 0.72) {
        depthClass = 'cloud-depth-near';
        scale = 1.08;
        zIndex = 20;
      }

      // Continuous visible drift ranges (20px to 45px)
      const driftX = ((pseudoRandom(seed + 6) * 30 + 15) * (pseudoRandom(seed + 7) > 0.5 ? 1 : -1)).toFixed(0);
      const driftY = ((pseudoRandom(seed + 8) * 26 + 12) * (pseudoRandom(seed + 9) > 0.5 ? 1 : -1)).toFixed(0);

      // Duration: 14s to 26s (calm but clearly moving continuously)
      const driftDur = (15 + pseudoRandom(seed + 10) * 11).toFixed(1);
      const driftDelay = (pseudoRandom(seed + 11) * 6).toFixed(1);

      // Unique trajectory variant
      const trajectory = CLOUD_TRAJECTORIES[index % CLOUD_TRAJECTORIES.length];
      const tint = CLOUD_TINTS[index % CLOUD_TINTS.length];

      return {
        post,
        style: {
          left: `${clampedX.toFixed(2)}%`,
          top: `${clampedY.toFixed(2)}%`,
          zIndex,
          '--rot-start': `${baseRot}deg`,
          '--rot-delta': `${rotDelta}deg`,
          '--drift-x': `${driftX}px`,
          '--drift-y': `${driftY}px`,
          '--drift-dur': `${driftDur}s`,
          '--drift-delay': `${driftDelay}s`,
          '--cloud-scale': `${scale}`,
          animationName: trajectory,
          animationDuration: `${driftDur}s`,
          animationDelay: `${driftDelay}s`,
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
        },
        tint,
        depthClass,
        isProminent: count <= 3,
      };
    });
  }, [posts]);
}
