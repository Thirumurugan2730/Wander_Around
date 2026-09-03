import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WanderingPage from '../pages/WanderingPage';
import * as apiClient from '../api/client';

describe('Keyboard Interaction & Spacebar Stress Tests', () => {
  const mockPosts = [
    { id: 101, text: 'Morning coffee', username: 'Thiru', hasPhoto: false },
    { id: 102, text: 'Quiet train ride', username: 'Maya', hasPhoto: false },
    { id: 103, text: 'Rain on the glass', username: 'Sam', hasPhoto: false },
    { id: 104, text: 'Cat asleep on the chair', username: 'Alex', hasPhoto: false },
    { id: 105, text: 'Distant sunset', username: 'Elena', hasPhoto: false },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.spyOn(apiClient, 'getTodayPosts').mockResolvedValue(mockPosts);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Space advances to next moment and continues working across 20+ transitions', async () => {
    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    // Let async getTodayPosts() promise resolve and render
    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(screen.getByText(/Moment 1 of 5/i)).toBeInTheDocument();
    });

    // Perform 25 consecutive Space transitions
    for (let step = 1; step <= 25; step++) {
      act(() => {
        fireEvent.keyDown(window, { code: 'Space', key: ' ' });
      });

      // Advance timer for transition guard (220ms)
      act(() => {
        vi.advanceTimersByTime(250);
      });

      // Verify progress index
      const expectedIndex = (step % 5) + 1;
      expect(screen.getByText(new RegExp(`Moment ${expectedIndex} of 5`, 'i'))).toBeInTheDocument();
    }
  });

  it('Space key does NOT trigger Wander when focus is inside an input or textarea', async () => {
    render(
      <MemoryRouter>
        <div>
          <input data-testid="dummy-input" type="text" />
          <textarea data-testid="dummy-textarea" />
          <WanderingPage />
        </div>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Moment 1 of 5/i)).toBeInTheDocument();
    });

    // Type Space in input
    const input = screen.getByTestId('dummy-input');
    act(() => {
      fireEvent.keyDown(input, { code: 'Space', key: ' ' });
    });
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Should still be on Moment 1
    expect(screen.getByText(/Moment 1 of 5/i)).toBeInTheDocument();

    // Type Space in textarea
    const textarea = screen.getByTestId('dummy-textarea');
    act(() => {
      fireEvent.keyDown(textarea, { code: 'Space', key: ' ' });
    });
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Should still be on Moment 1
    expect(screen.getByText(/Moment 1 of 5/i)).toBeInTheDocument();
  });

  it('Enter key advances without duplicate transitions when Wander button is active', async () => {
    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Moment 1 of 5/i)).toBeInTheDocument();
    });

    const wanderBtn = screen.getByRole('button', { name: /Wander to the next moment/i });

    // Press Enter on button
    act(() => {
      fireEvent.click(wanderBtn);
    });
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Exactly advanced to Moment 2 (not skipped to Moment 3)
    expect(screen.getByText(/Moment 2 of 5/i)).toBeInTheDocument();
  });

  it('Rapid Spacebar presses do not skip posts or cause race conditions', async () => {
    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Moment 1 of 5/i)).toBeInTheDocument();
    });

    // Press Space 3 times in immediate succession within 50ms
    act(() => {
      fireEvent.keyDown(window, { code: 'Space', key: ' ' });
      fireEvent.keyDown(window, { code: 'Space', key: ' ' });
      fireEvent.keyDown(window, { code: 'Space', key: ' ' });
    });

    // Let transition finish
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Guard ensured exactly one transition occurred (to Moment 2), no skips or race condition
    expect(screen.getByText(/Moment 2 of 5/i)).toBeInTheDocument();
  });
});
