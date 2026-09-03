import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Pure Fisher–Yates shuffle implementation.
 * Never mutates the input array.
 */
export function fisherYatesShuffle(array, rng = Math.random) {
  if (!array || !Array.isArray(array)) return [];
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * useWanderSession Hook
 * 
 * Owns client-side wandering session state:
 * - Shuffles once per session.
 * - Shows the first moment automatically.
 * - Traverses sequentially without immediate repeats within a cycle.
 * - Reshuffles on exhaustion with boundary repeat prevention.
 * - Preserves stable session order across unrelated React re-renders.
 */
export function useWanderSession(posts = [], rng = Math.random) {
  const [shuffledPosts, setShuffledPosts] = useState(() => fisherYatesShuffle(posts, rng));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(1);

  // Track signature of posts array to re-initialize only when posts change
  const postsSignature = Array.isArray(posts) ? posts.map((p) => p.id).join(',') : '';
  const prevSignatureRef = useRef(postsSignature);

  useEffect(() => {
    if (postsSignature !== prevSignatureRef.current) {
      prevSignatureRef.current = postsSignature;
      const fresh = fisherYatesShuffle(posts, rng);
      setShuffledPosts(fresh);
      setCurrentIndex(0);
      setCycleCount(1);
    }
  }, [postsSignature, posts, rng]);

  const totalPosts = shuffledPosts.length;
  const currentPost = totalPosts > 0 ? shuffledPosts[currentIndex] : null;

  const wander = useCallback(() => {
    if (totalPosts === 0) return null;

    if (currentIndex < totalPosts - 1) {
      // Advance to next post in current cycle
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Current cycle exhausted! Fresh shuffle for next cycle
      const lastPost = shuffledPosts[shuffledPosts.length - 1];
      let nextShuffled = fisherYatesShuffle(posts, rng);

      // Boundary repeat prevention: If posts.length >= 2 and new cycle starts with last post, swap
      if (posts.length >= 2 && nextShuffled[0]?.id === lastPost?.id) {
        const swapIdx = 1 + Math.floor(rng() * (nextShuffled.length - 1));
        [nextShuffled[0], nextShuffled[swapIdx]] = [nextShuffled[swapIdx], nextShuffled[0]];
      }

      setShuffledPosts(nextShuffled);
      setCurrentIndex(0);
      setCycleCount((prev) => prev + 1);
    }
  }, [totalPosts, currentIndex, shuffledPosts, posts, rng]);

  const resetSession = useCallback(() => {
    const fresh = fisherYatesShuffle(posts, rng);
    setShuffledPosts(fresh);
    setCurrentIndex(0);
    setCycleCount(1);
  }, [posts, rng]);

  return {
    currentPost,
    currentIndex,
    totalPosts,
    cycleCount,
    wander,
    resetSession,
  };
}
