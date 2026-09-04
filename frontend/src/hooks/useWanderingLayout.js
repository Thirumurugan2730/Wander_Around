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

const WIND_TRAJECTORIES = [
  'windDriftBreezeA',
  'windDriftBreezeB',
  'windDriftAscend',
  'windDriftDescend',
  'windDriftWave',
  'windDriftSweep',
];

const PHOTO_COMPOSITIONS = ['photo-rest', 'photo-hang', 'photo-overlap'];
const TEXT_COMPOSITIONS = ['text-note', 'text-tuck'];

/**
 * Computes organic sky positions, cloud silhouettes, photo/note compositions,
 * depth levels, and wind-drift physics for every moment.
 */
export function useWanderingLayout(posts = []) {
  return useMemo(() => {
    const count = posts.length;
    if (count === 0) return [];

    // Single moment: centered gracefully in the middle sky
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
          '--wind-drift-x': '45px',
          '--wind-drift-y': '22px',
          '--drift-dur': '26s',
          '--drift-delay': '0s',
          '--cloud-scale': '1.08',
          animationName: 'windDriftBreezeA',
          animationDuration: '26s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
        },
        cloudVariant: 0,
        compositionType: hasPhoto ? (post.text ? 'photo-text-combo' : 'photo-rest') : 'text-note',
        depthClass: 'depth-near',
        isProminent: true,
      }];
    }

    // Grid zone partitioning to guarantee wide dispersion across the sky
    const cols = count <= 3 ? 2 : count <= 8 ? 3 : count <= 15 ? 4 : count <= 24 ? 5 : 6;
    const rows = Math.ceil(count / cols);

    const cellWidth = 86 / cols; // % of canvas width
    const cellHeight = 80 / rows; // % of canvas height

    return posts.map((post, index) => {
      const postKey = String(post.id || index);
      const seed = stringToSeed(postKey) + index * 47;

      const col = index % cols;
      const row = Math.floor(index / cols);

      // Deterministic organic jitter inside assigned zone
      const jitterX = (pseudoRandom(seed + 1) - 0.5) * (cellWidth * 0.52);
      const jitterY = (pseudoRandom(seed + 2) - 0.5) * (cellHeight * 0.52);

      const baseX = 7 + col * cellWidth + cellWidth / 2 + jitterX;
      const baseY = 8 + row * cellHeight + cellHeight / 2 + jitterY;

      const clampedX = Math.max(4, Math.min(84, baseX));
      const clampedY = Math.max(6, Math.min(82, baseY));

      // Deterministic photo tilt: -4.5deg to +4.5deg
      const baseRot = (pseudoRandom(seed + 3) * 9 - 4.5).toFixed(1);
      const rotDelta = (pseudoRandom(seed + 4) * 2.5 + 1.2).toFixed(1);

      // Depth classification for atmospheric perspective
      const depthVal = pseudoRandom(seed + 5);
      let depthClass = 'depth-mid';
      let scale = 1.0;
      let zIndex = 15;

      if (depthVal < 0.28) {
        depthClass = 'depth-far';
        scale = 0.88;
        zIndex = 5;
      } else if (depthVal > 0.72) {
        depthClass = 'depth-near';
        scale = 1.08;
        zIndex = 22;
      }

      // Wind drift translation (noticeable movement in 2-3s: 35px to 75px)
      const driftX = (pseudoRandom(seed + 6) * 35 + 40).toFixed(0);
      const driftY = ((pseudoRandom(seed + 7) * 25 + 15) * (pseudoRandom(seed + 8) > 0.5 ? 1 : -1)).toFixed(0);

      // Durations: 20s, 26s, 32s, 38s, 44s, 50s
      const durations = [20, 26, 32, 38, 44, 50];
      const driftDur = durations[Math.floor(pseudoRandom(seed + 9) * durations.length)];
      const driftDelay = (pseudoRandom(seed + 10) * 8).toFixed(1);

      const trajectory = WIND_TRAJECTORIES[index % WIND_TRAJECTORIES.length];
      const cloudVariant = index % 4;

      // Composition assignment
      const hasPhoto = Boolean(post.hasPhoto || post.has_photo || post.imagePath || post.image_path);
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
          '--drift-delay': `${driftDelay}s`,
          '--cloud-scale': `${scale}`,
          animationName: trajectory,
          animationDuration: `${driftDur}s`,
          animationDelay: `${driftDelay}s`,
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
        },
        cloudVariant,
        compositionType,
        depthClass,
        isProminent: count <= 3,
      };
    });
  }, [posts]);
}
