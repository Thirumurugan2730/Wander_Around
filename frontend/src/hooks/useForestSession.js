import { useState, useEffect, useMemo, useRef } from 'react';

/**
 * useForestSession Hook
 * Orchestrates the messenger bird flight loop, memory cycling, and drifting notes:
 * - Partitions posts into photo memories (carried by bird) and text memories (drifting on wind)
 * - Drives the bird flight sequence: flying-in -> landing (branch bounce) -> perched -> flying-out -> resting -> cycle next photo
 * - Pauses flight progression when a memory modal is actively open
 * - Computes staggered wind drift parameters for text memories
 */
export function useForestSession(posts = [], isModalOpen = false) {
  // Partition into photo and text memories
  const { photoPosts, textPosts } = useMemo(() => {
    const photos = [];
    const texts = [];

    posts.forEach((post) => {
      const hasPhoto = Boolean(
        post.hasPhoto || post.has_photo || post.imagePath || post.image_path
      );
      if (hasPhoto) {
        photos.push(post);
      } else {
        texts.push(post);
      }
    });

    return { photoPosts: photos, textPosts: texts };
  }, [posts]);

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [flightPhase, setFlightPhase] = useState('perched'); // 'flying-in' | 'landing' | 'perched' | 'flying-out' | 'resting'
  const [isBranchBouncing, setIsBranchBouncing] = useState(false);

  const phaseTimerRef = useRef(null);
  const bounceTimerRef = useRef(null);
  const isModalOpenRef = useRef(isModalOpen);

  useEffect(() => {
    isModalOpenRef.current = isModalOpen;
  }, [isModalOpen]);

  // Keep activePhotoIndex within bounds when posts change
  useEffect(() => {
    if (photoPosts.length > 0 && activePhotoIndex >= photoPosts.length) {
      setActivePhotoIndex(0);
    }
  }, [photoPosts.length, activePhotoIndex]);

  // Bird flight lifecycle cycle
  useEffect(() => {
    // If no photos exist, bird rests or makes occasional peaceful visits
    if (photoPosts.length === 0) {
      setFlightPhase('perched');
      return;
    }

    let isMounted = true;

    function runPhase(phase, durationMs) {
      if (!isMounted) return;

      // If user opened a modal, pause transition during perched phase
      if (isModalOpenRef.current && phase === 'perched') {
        phaseTimerRef.current = setTimeout(() => runPhase('perched', 2000), 2000);
        return;
      }

      setFlightPhase(phase);

      if (phase === 'landing') {
        setIsBranchBouncing(true);
        if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
        bounceTimerRef.current = setTimeout(() => {
          if (isMounted) setIsBranchBouncing(false);
        }, 900);
      }

      phaseTimerRef.current = setTimeout(() => {
        if (!isMounted) return;

        // Sequence transitions
        if (phase === 'flying-in') {
          runPhase('landing', 1200);
        } else if (phase === 'landing') {
          runPhase('perched', 8500); // Perched comfortably for 8.5 seconds
        } else if (phase === 'perched') {
          // If modal is open, remain perched
          if (isModalOpenRef.current) {
            runPhase('perched', 3000);
          } else {
            runPhase('flying-out', 3500);
          }
        } else if (phase === 'flying-out') {
          runPhase('resting', 4000); // 4 seconds peaceful interval before next visit
        } else if (phase === 'resting') {
          // Advance to next photo
          setActivePhotoIndex((prev) => (prev + 1) % photoPosts.length);
          runPhase('flying-in', 4500);
        }
      }, durationMs);
    }

    // Start in perched state initially on load, then begin cycle
    runPhase('perched', 7000);

    return () => {
      isMounted = false;
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
      if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
    };
  }, [photoPosts.length]);

  // Active photo being carried / perched
  const currentPhotoPost = photoPosts.length > 0 ? photoPosts[activePhotoIndex] : null;

  // Staggered layout parameters for drifting text memories
  const textNoteItems = useMemo(() => {
    return textPosts.map((post, idx) => {
      const altIndex = idx % 4; // 4 vertical breeze streams
      const duration = 28 + (idx % 3) * 6;
      const delay = idx === 0 ? -12 : (idx * 9);
      const rot = (Math.sin(idx * 3.7) * 4).toFixed(1);

      return {
        post,
        altitudeClass: `alt-stream-${altIndex}`,
        style: {
          '--drift-rot': `${rot}deg`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          zIndex: 14 + (idx % 4),
        },
      };
    });
  }, [textPosts]);

  return {
    photoPosts,
    textPosts,
    currentPhotoPost,
    activePhotoIndex,
    flightPhase,
    isBranchBouncing,
    textNoteItems,
  };
}
