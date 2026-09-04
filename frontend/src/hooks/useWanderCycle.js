import { useState, useEffect, useRef, useCallback } from 'react';

const CALM_DURATION = 9500; // ~9.5-10s calm floating between gusts
const GUST_DURATION = 6500; // ~6.5s wind surge & cloud flow transition

/**
 * useWanderCycle
 * Orchestrates the 10-second wind gust & cloud flow lifecycle:
 * 1. All clouds float gently for ~10 seconds.
 * 2. Wind gust triggers from LEFT to RIGHT.
 * 3. ALL clouds catch the wind, accelerate, and exit off-screen RIGHT.
 * 4. New cloud arrangement enters smoothly from the LEFT.
 * 5. Returns to calm float in new organic positions.
 * 6. Repeats every ~10 seconds.
 */
export function useWanderCycle(posts = [], isPaused = false) {
  const [cycleIndex, setCycleIndex] = useState(0);
  const [isGusting, setIsGusting] = useState(false);

  const timerRef = useRef(null);
  const postsCount = posts.length;

  // Advance to next gust cycle
  const triggerGust = useCallback(() => {
    setIsGusting(true);

    // After GUST_DURATION, the gust finishes, incoming clouds settle in, and calm phase starts
    timerRef.current = setTimeout(() => {
      setIsGusting(false);
      setCycleIndex((prev) => prev + 1);
    }, GUST_DURATION);
  }, []);

  useEffect(() => {
    if (isPaused || postsCount === 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    if (!isGusting) {
      // We are in the calm phase: wait CALM_DURATION (~10s) before launching the next gust
      timerRef.current = setTimeout(() => {
        triggerGust();
      }, CALM_DURATION);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, isGusting, postsCount, cycleIndex, triggerGust]);

  return {
    isGusting,
    cycleIndex,
    currentPosts: posts,
    incomingPosts: posts,
  };
}
