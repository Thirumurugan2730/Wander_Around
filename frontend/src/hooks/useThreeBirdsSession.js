import { useState, useEffect, useRef, useMemo } from 'react';

/**
 * useThreeBirdsSession Hook
 * Orchestrates the independent, asynchronous life cycles of THREE realistic messenger birds
 * visiting the THREE main forest trees (Left, Center, Right).
 * 
 * Life Cycle per Bird:
 * - flying-in -> landing (triggers tree branch bounce) -> perched (rests with pouch) -> flying-out -> resting -> next post
 * - Staggered intervals so birds never move in robotic synchronization
 * - Pauses phase progression while a memory reveal modal is open
 */
export function useThreeBirdsSession(posts = [], isModalOpen = false) {
  // Store active post indices for each of the 3 birds
  const [birdPostIndices, setBirdPostIndices] = useState([0, 1, 2]);
  const [flightPhases, setFlightPhases] = useState(['perched', 'perched', 'resting']);
  const [bouncingTrees, setBouncingTrees] = useState({ 0: false, 1: false, 2: false });

  const isModalOpenRef = useRef(isModalOpen);
  const timersRef = useRef([null, null, null]);
  const bounceTimersRef = useRef([null, null, null]);

  useEffect(() => {
    isModalOpenRef.current = isModalOpen;
  }, [isModalOpen]);

  // Keep post indices valid when posts array changes
  useEffect(() => {
    if (posts.length > 0) {
      setBirdPostIndices([
        0 % posts.length,
        (1 % posts.length),
        (2 % posts.length),
      ]);
    }
  }, [posts.length]);

  // Independent flight loops for Bird 0, Bird 1, Bird 2
  useEffect(() => {
    if (posts.length === 0) {
      setFlightPhases(['perched', 'perched', 'resting']);
      return;
    }

    let isMounted = true;

    // Config per bird species for natural asynchronous rhythm
    const birdConfigs = [
      { id: 0, treeId: 0, perchedDuration: 9500, restingDuration: 7000, flyInDuration: 4200, flyOutDuration: 3400, initialPhase: 'perched', initialDelay: 8000 },
      { id: 1, treeId: 1, perchedDuration: 11000, restingDuration: 9000, flyInDuration: 4500, flyOutDuration: 3600, initialPhase: 'perched', initialDelay: 13000 },
      { id: 2, treeId: 2, perchedDuration: 8500, restingDuration: 11000, flyInDuration: 4000, flyOutDuration: 3200, initialPhase: 'resting', initialDelay: 4000 },
    ];

    function runBirdPhase(birdIndex, phase, durationMs) {
      if (!isMounted) return;

      // If user opened modal, hold in perched state
      if (isModalOpenRef.current && phase === 'perched') {
        timersRef.current[birdIndex] = setTimeout(() => {
          runBirdPhase(birdIndex, 'perched', 2500);
        }, 2500);
        return;
      }

      setFlightPhases((prev) => {
        const next = [...prev];
        next[birdIndex] = phase;
        return next;
      });

      // Branch bounce when landing on assigned tree
      if (phase === 'landing') {
        const treeId = birdConfigs[birdIndex].treeId;
        setBouncingTrees((prev) => ({ ...prev, [treeId]: true }));
        if (bounceTimersRef.current[treeId]) clearTimeout(bounceTimersRef.current[treeId]);
        bounceTimersRef.current[treeId] = setTimeout(() => {
          if (isMounted) {
            setBouncingTrees((prev) => ({ ...prev, [treeId]: false }));
          }
        }, 850);
      }

      timersRef.current[birdIndex] = setTimeout(() => {
        if (!isMounted) return;
        const cfg = birdConfigs[birdIndex];

        if (phase === 'flying-in') {
          runBirdPhase(birdIndex, 'landing', 1100);
        } else if (phase === 'landing') {
          runBirdPhase(birdIndex, 'perched', cfg.perchedDuration);
        } else if (phase === 'perched') {
          if (isModalOpenRef.current) {
            runBirdPhase(birdIndex, 'perched', 3000);
          } else {
            runBirdPhase(birdIndex, 'flying-out', cfg.flyOutDuration);
          }
        } else if (phase === 'flying-out') {
          runBirdPhase(birdIndex, 'resting', cfg.restingDuration);
        } else if (phase === 'resting') {
          // Advance to next post when taking off for next flight
          setBirdPostIndices((prev) => {
            const next = [...prev];
            next[birdIndex] = (next[birdIndex] + 3) % posts.length;
            return next;
          });
          runBirdPhase(birdIndex, 'flying-in', cfg.flyInDuration);
        }
      }, durationMs);
    }

    // Launch each bird on its staggered schedule
    birdConfigs.forEach((cfg) => {
      runBirdPhase(cfg.id, cfg.initialPhase, cfg.initialDelay);
    });

    return () => {
      isMounted = false;
      timersRef.current.forEach((t) => t && clearTimeout(t));
      bounceTimersRef.current.forEach((t) => t && clearTimeout(t));
    };
  }, [posts.length]);

  // Derive current bird state records
  const birds = useMemo(() => {
    if (posts.length === 0) {
      return [
        { birdIndex: 0, treeId: 0, post: null, flightPhase: 'perched' },
        { birdIndex: 1, treeId: 1, post: null, flightPhase: 'perched' },
        { birdIndex: 2, treeId: 2, post: null, flightPhase: 'resting' },
      ];
    }

    return [0, 1, 2].map((idx) => {
      const postIdx = birdPostIndices[idx] % posts.length;
      return {
        birdIndex: idx,
        treeId: idx,
        post: posts[postIdx],
        flightPhase: flightPhases[idx] || 'perched',
      };
    });
  }, [posts, birdPostIndices, flightPhases]);

  return {
    birds,
    bouncingTrees,
  };
}
