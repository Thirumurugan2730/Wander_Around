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

const PHOTO_COMPOSITIONS = ['photo-rest', 'photo-hang', 'photo-overlap'];
const TEXT_COMPOSITIONS = ['text-note', 'text-tuck'];

// Staggered initial flight delays for the 5 vertical altitude lanes (initial load distribution)
const INITIAL_LANE_DELAYS = [-24, -15, -7, -29, -11];

/**
 * useWanderingLayout
 * Computes sequential one-by-one Left → Right cloud stream parameters:
 * - 5 vertical altitude lanes
 * - Pure GPU CSS transform keyframe animations
 * - Staggered entrance timing ensuring no cloud crowding or collisions
 * - Scale factor dynamically tailored to total memory count
 */
export function useWanderingLayout(posts = []) {
  return useMemo(() => {
    const count = posts.length;
    if (count === 0) return [];

    // Scale tier based on memory volume (always fitting the fixed viewport comfortably)
    const cloudScale = count <= 5 ? 1.15 : count <= 15 ? 1.0 : 0.88;

    return posts.map((post, index) => {
      const postKey = String(post.id || index);
      const seed = stringToSeed(postKey) + index * 47;

      // Assign to one of 5 vertical altitude lanes
      const laneIndex = index % 5;
      const laneQueueIndex = Math.floor(index / 5);

      const hasPhoto = Boolean(post.hasPhoto || post.has_photo || post.imagePath || post.image_path);

      // Traversal duration: heavier photo clouds glide majestically (34s-44s), text notes (28s-36s)
      const baseDuration = hasPhoto
        ? 34 + Math.floor(pseudoRandom(seed + 1) * 10)
        : 28 + Math.floor(pseudoRandom(seed + 1) * 8);

      // Staggered delay:
      // First wave (index < 5) has negative delays to be naturally distributed across screen width on load
      // Subsequent waves (index >= 5) queue up with positive entrance spacing
      let animationDelay;
      if (laneQueueIndex === 0) {
        animationDelay = `${INITIAL_LANE_DELAYS[laneIndex]}s`;
      } else {
        const queuedDelay = (laneQueueIndex * 15 + (pseudoRandom(seed + 2) * 5)).toFixed(1);
        animationDelay = `${queuedDelay}s`;
      }

      // Deterministic physical photo tilt: -3.5deg to +3.5deg
      const baseRot = (pseudoRandom(seed + 3) * 7 - 3.5).toFixed(1);

      // Depth classification for atmospheric perspective
      const depthVal = pseudoRandom(seed + 4);
      let depthClass = 'depth-mid';
      let zIndex = 15;

      if (depthVal < 0.28) {
        depthClass = 'depth-far';
        zIndex = 5;
      } else if (depthVal > 0.72) {
        depthClass = 'depth-near';
        zIndex = 22;
      }

      // Sunlight classification based on altitude lane (upper lanes catch more sunlight)
      let sunlitClass = 'sunlit-neutral';
      if (laneIndex === 0 || laneIndex === 1) {
        sunlitClass = 'sunlit-warm';
      } else if (laneIndex === 3 || laneIndex === 4) {
        sunlitClass = 'sunlit-cool';
      }

      const cloudVariant = index % 4;

      // Composition assignment
      let compositionType = 'photo-rest';
      if (hasPhoto) {
        if (post.text && post.text.trim().length > 0) {
          compositionType = 'photo-text-combo';
        } else {
          compositionType = PHOTO_COMPOSITIONS[Math.floor(pseudoRandom(seed + 5) * PHOTO_COMPOSITIONS.length)];
        }
      } else {
        compositionType = TEXT_COMPOSITIONS[Math.floor(pseudoRandom(seed + 6) * TEXT_COMPOSITIONS.length)];
      }

      return {
        post,
        laneClass: `lane-${laneIndex}`,
        style: {
          zIndex,
          '--rot-start': `${baseRot}deg`,
          '--cloud-scale': `${cloudScale}`,
          '--lane-index': `${laneIndex}`,
          animationDuration: `${baseDuration}s`,
          animationDelay,
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
