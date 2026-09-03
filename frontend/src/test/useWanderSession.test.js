import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { fisherYatesShuffle, useWanderSession } from '../hooks/useWanderSession';

describe('fisherYatesShuffle', () => {
  it('Test 1 — preserves all elements without duplicates or omissions', () => {
    const original = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
    const shuffled = fisherYatesShuffle(original);

    expect(shuffled).toHaveLength(original.length);
    expect(shuffled.map((p) => p.id).sort()).toEqual(original.map((p) => p.id).sort());
  });

  it('Test 2 — never mutates original array', () => {
    const original = Object.freeze([{ id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }]);
    const originalIdsBefore = original.map((p) => p.id);

    const shuffled = fisherYatesShuffle(original);

    expect(original.map((p) => p.id)).toEqual(originalIdsBefore);
    expect(shuffled).not.toBe(original);
  });

  it('Test 8 — deterministic shuffle with mock rng', () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    // Fixed RNG sequence
    let i = 0;
    const rngSequence = [0.1, 0.9, 0.5];
    const mockRng = () => rngSequence[i++ % rngSequence.length];

    const result = fisherYatesShuffle(items, mockRng);
    expect(result).toHaveLength(4);
    expect(result.map((p) => p.id).sort()).toEqual([1, 2, 3, 4]);
  });
});

describe('useWanderSession Hook', () => {
  const mockPosts = [
    { id: 'A', text: 'Moment A' },
    { id: 'B', text: 'Moment B' },
    { id: 'C', text: 'Moment C' },
    { id: 'D', text: 'Moment D' },
  ];

  it('Test 3 — Sequential traversal: displays first post automatically and advances sequentially', () => {
    const { result } = renderHook(() => useWanderSession(mockPosts));

    expect(result.current.totalPosts).toBe(4);
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentPost).not.toBeNull();

    const firstPostId = result.current.currentPost.id;
    const visitedIds = [firstPostId];

    // Wander 3 times to complete cycle 1
    act(() => {
      result.current.wander();
    });
    expect(result.current.currentIndex).toBe(1);
    visitedIds.push(result.current.currentPost.id);

    act(() => {
      result.current.wander();
    });
    expect(result.current.currentIndex).toBe(2);
    visitedIds.push(result.current.currentPost.id);

    act(() => {
      result.current.wander();
    });
    expect(result.current.currentIndex).toBe(3);
    visitedIds.push(result.current.currentPost.id);

    // Verify all 4 unique posts were visited in cycle 1
    expect(visitedIds).toHaveLength(4);
    expect(new Set(visitedIds).size).toBe(4);
    expect(visitedIds.sort()).toEqual(['A', 'B', 'C', 'D']);
  });

  it('Test 4 & 5 — Exhaustion and Boundary Repeat Prevention', () => {
    const { result } = renderHook(() => useWanderSession(mockPosts));

    // Complete cycle 1 (indices 0, 1, 2, 3)
    act(() => { result.current.wander(); });
    act(() => { result.current.wander(); });
    act(() => { result.current.wander(); });

    const lastPostOfCycle1 = result.current.currentPost;
    expect(result.current.currentIndex).toBe(3);
    expect(result.current.cycleCount).toBe(1);

    // Advance into Cycle 2
    act(() => {
      result.current.wander();
    });

    expect(result.current.cycleCount).toBe(2);
    expect(result.current.currentIndex).toBe(0);

    const firstPostOfCycle2 = result.current.currentPost;

    // Boundary rule: cycle 2 first post MUST NOT be cycle 1's final post
    expect(firstPostOfCycle2.id).not.toBe(lastPostOfCycle1.id);
  });

  it('Test 6 — Single post dataset repeats gracefully', () => {
    const singlePost = [{ id: 'SOLO', text: 'Lone moment' }];
    const { result } = renderHook(() => useWanderSession(singlePost));

    expect(result.current.totalPosts).toBe(1);
    expect(result.current.currentPost.id).toBe('SOLO');

    act(() => {
      result.current.wander();
    });

    expect(result.current.currentPost.id).toBe('SOLO');
    expect(result.current.cycleCount).toBe(2);
  });

  it('Test 7 — Empty dataset returns null currentPost without throwing', () => {
    const { result } = renderHook(() => useWanderSession([]));

    expect(result.current.totalPosts).toBe(0);
    expect(result.current.currentPost).toBeNull();

    act(() => {
      result.current.wander();
    });

    expect(result.current.currentPost).toBeNull();
  });
});
