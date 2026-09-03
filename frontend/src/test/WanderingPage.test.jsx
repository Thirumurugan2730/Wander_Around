import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WanderingPage from '../pages/WanderingPage';
import * as apiClient from '../api/client';

describe('WanderingPage Single-Focus Discovery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state then single-focus moment card', async () => {
    const mockPosts = [
      { id: 1, text: 'Morning reflections', username: 'Thiru', hasPhoto: false },
      { id: 2, text: 'Sunset glow', username: 'Elena', hasPhoto: false },
    ];
    vi.spyOn(apiClient, 'getTodayPosts').mockResolvedValue(mockPosts);

    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    // Initial loading indicator
    expect(screen.getByText(/Finding today's little moments.../i)).toBeInTheDocument();

    // After loading finishes
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Somewhere, today\.\.\./i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Wander to the next moment/i })).toBeInTheDocument();
    });

    // Verify exactly ONE moment card article is rendered in the DOM (Single Focus!)
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(1);
    expect(screen.getByText(/Moment 1 of 2/i)).toBeInTheDocument();
  });

  it('advances to next moment on Wander button click without calling API', async () => {
    const mockPosts = [
      { id: 'POST_A', text: 'First moment A', username: 'UserA', hasPhoto: false },
      { id: 'POST_B', text: 'Second moment B', username: 'UserB', hasPhoto: false },
    ];
    const fetchSpy = vi.spyOn(apiClient, 'getTodayPosts').mockResolvedValue(mockPosts);

    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Moment 1 of 2/i)).toBeInTheDocument();
    });

    // Exactly 1 fetch occurred on page load
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const wanderBtn = screen.getByRole('button', { name: /Wander to the next moment/i });
    fireEvent.click(wanderBtn);

    await waitFor(() => {
      expect(screen.getByText(/Moment 2 of 2/i)).toBeInTheDocument();
    });

    // Still exactly 1 fetch call: ZERO API requests occurred on Wander click!
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('displays empty state when zero posts are returned', async () => {
    vi.spyOn(apiClient, 'getTodayPosts').mockResolvedValue([]);

    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/It's quiet here\./i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Leave today's first moment/i })).toBeInTheDocument();
    });
  });

  it('displays friendly error state on network or server error', async () => {
    vi.spyOn(apiClient, 'getTodayPosts').mockRejectedValue(new Error('Network error'));

    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /The wind got in the way\./i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Try again/i })).toBeInTheDocument();
    });
  });
});
