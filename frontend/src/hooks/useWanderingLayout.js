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
 * - 5 vertical altitude lanes with safe margins (no vertical cropping)
 * - Pure GPU CSS transform keyframe animations
 * - Staggered entrance timing ensuring no cloud crowding or collisions
 * - Natural atmospheric depth (background slower/softer, foreground crisp/dynamic)
 */
export function useWanderingLayout(posts = []) {
  return useMemo(() => {
    const count = posts.length;
    if (count === 0) return [];

    // Base scale tier
    const baseCloudScale = count <= 5 ? 0.98 : count <= 15 ? 0.90 : 0.82;

    return posts.map((post, index) => {
      const postKey = String(post.id || index);
      const seed = stringToSeed(postKey) + index * 47;

      // Assign to one of 5 vertical altitude lanes
      const laneIndex = index % 5;
      const laneQueueIndex = Math.floor(index / 5);

      const hasPhoto = Boolean(post.hasPhoto || post.has_photo || post.imagePath || post.image_path);

      // Depth classification for natural atmospheric perspective
      const depthVal = pseudoRandom(seed + 4);
      let depthClass = 'depth-mid';
      let zIndex = 15;
      let effectiveScale = baseCloudScale;
      let speedFactor = 1.0;

      if (depthVal < 0.28) {
        depthClass = 'depth-far';
        zIndex = 5;
        effectiveScale = Number((baseCloudScale * 0.86).toFixed(2));
        speedFactor = 1.25; // Slower background drift
      } else if (depthVal > 0.72) {
        depthClass = 'depth-near';
        zIndex = 22;
        effectiveScale = Number((baseCloudScale * 1.06).toFixed(2));
        speedFactor = 0.88; // Slightly faster foreground glide
      }

      // Traversal duration: heavier photo clouds glide majestically, text notes lighter
      const rawDuration = hasPhoto
        ? 34 + Math.floor(pseudoRandom(seed + 1) * 8)
        : 28 + Math.floor(pseudoRandom(seed + 1) * 6);
      const baseDuration = Math.round(rawDuration * speedFactor);

      // Staggered delay:
      // First wave (index < 5) has negative delays to be naturally distributed across screen width on load
      // Subsequent waves (index >= 5) queue up with positive entrance spacing
      let animationDelay;
      if (laneQueueIndex === 0) {
        animationDelay = `${INITIAL_LANE_DELAYS[laneIndex]}s`;
      } else {
        const queuedDelay = (laneQueueIndex * 14 + (pseudoRandom(seed + 2) * 5)).toFixed(1);
        animationDelay = `${queuedDelay}s`;
      }

      // Deterministic physical photo tilt: -3deg to +3deg
      const baseRot = (pseudoRandom(seed + 3) * 6 - 3).toFixed(1);

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
          '--cloud-scale': `${effectiveScale}`,
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
