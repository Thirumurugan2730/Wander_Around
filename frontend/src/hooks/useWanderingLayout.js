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

// Sun position in upper-right sky
const SUN_POS = { x: 78, y: 10 };

/**
 * Computes organic sky positions, cloud silhouettes, photo/note compositions,
 * depth levels, sunlight proximity, and wind-gust physics for a set of posts.
 */
export function useWanderingLayout(posts = [], cycleIndex = 0) {
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
          '--wind-drift-x': '40px',
          '--wind-drift-y': '18px',
          '--gust-stagger': '0.1s',
          '--cloud-scale': '1.08',
        },
        cloudVariant: 0,
        compositionType: hasPhoto ? (post.text ? 'photo-text-combo' : 'photo-rest') : 'text-note',
        depthClass: 'depth-near',
        sunlitClass: 'sunlit-warm',
        isProminent: true,
      }];
    }

    // Grid zone partitioning (2 or 3 columns for spacious cloud drifting)
    const cols = count <= 3 ? 2 : count <= 6 ? 3 : 4;
    const rows = Math.ceil(count / cols);

    const cellWidth = 84 / cols; // % of canvas width
    const cellHeight = 76 / rows; // % of canvas height

    return posts.map((post, index) => {
      const postKey = String(post.id || index);
      const seed = stringToSeed(postKey) + (index * 53) + (cycleIndex * 101);

      const col = index % cols;
      const row = Math.floor(index / cols);

      // Organic jitter inside assigned sky zone
      const jitterX = (pseudoRandom(seed + 1) - 0.5) * (cellWidth * 0.52);
      const jitterY = (pseudoRandom(seed + 2) - 0.5) * (cellHeight * 0.52);

      const baseX = 8 + col * cellWidth + cellWidth / 2 + jitterX;
      const baseY = 9 + row * cellHeight + cellHeight / 2 + jitterY;

      const clampedX = Math.max(6, Math.min(82, baseX));
      const clampedY = Math.max(7, Math.min(80, baseY));

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

      // Wind gust stagger: clouds on the left (lower X) feel the gust first
      const gustStagger = ((clampedX / 100) * 0.9 + pseudoRandom(seed + 6) * 0.35).toFixed(2);

      // Organic hover translations during calm floating
      const driftX = (pseudoRandom(seed + 7) * 25 + 20).toFixed(0);
      const driftY = ((pseudoRandom(seed + 8) * 18 + 10) * (pseudoRandom(seed + 9) > 0.45 ? 1 : -1)).toFixed(0);

      const cloudVariant = index % 4;
      const hasPhoto = Boolean(post.hasPhoto || post.has_photo || post.imagePath || post.image_path);

      // Composition assignment
      let compositionType = 'photo-rest';
      if (hasPhoto) {
        if (post.text && post.text.trim().length > 0) {
          compositionType = 'photo-text-combo';
        } else {
          compositionType = PHOTO_COMPOSITIONS[Math.floor(pseudoRandom(seed + 10) * PHOTO_COMPOSITIONS.length)];
        }
      } else {
        compositionType = TEXT_COMPOSITIONS[Math.floor(pseudoRandom(seed + 11) * TEXT_COMPOSITIONS.length)];
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
          '--gust-stagger': `${gustStagger}s`,
          '--cloud-scale': `${scale}`,
        },
        cloudVariant,
        compositionType,
        depthClass,
        sunlitClass,
        isProminent: count <= 3,
      };
    });
  }, [posts, cycleIndex]);
}
