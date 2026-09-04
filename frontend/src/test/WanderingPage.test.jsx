import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WanderingPage from '../pages/WanderingPage';
import * as apiClient from '../api/client';

describe('WanderingPage True Wandering Canvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state then all moments together on one living canvas', async () => {
    const mockPosts = [
      { id: 1, text: 'Morning reflections', username: 'Thiru', hasPhoto: false },
      { id: 2, text: 'Sunset glow', username: 'Elena', hasPhoto: false },
      { id: 3, text: 'Coffee with rain', username: 'Sam', hasPhoto: true, imagePath: 'coffee.webp' },
    ];
    vi.spyOn(apiClient, 'getTodayPosts').mockResolvedValue(mockPosts);

    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    // Initial loading indicator
    expect(screen.getByText(/Finding today's little moments.../i)).toBeInTheDocument();

    // After loading finishes, canvas should be present with all 3 moments rendered simultaneously
    await waitFor(() => {
      expect(screen.getByText(/3 memories floating through today/i)).toBeInTheDocument();
    });

    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(3);
    expect(screen.getByText('Morning reflections')).toBeInTheDocument();
    expect(screen.getByText('Sunset glow')).toBeInTheDocument();
    expect(screen.getByText('Coffee with rain')).toBeInTheDocument();
  });

  it('expands selected moment on the same screen when clicked without extra API calls', async () => {
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
      expect(screen.getByText(/2 memories floating through today/i)).toBeInTheDocument();
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // Click on First moment card
    const firstCard = screen.getByRole('button', { name: /Text memory by UserA/i });
    fireEvent.click(firstCard);

    // Dialog / Expanded modal appears on same screen
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /Expanded memory by UserA/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Return to wandering canvas/i })).toBeInTheDocument();
    });

    // Close expanded view
    const closeBtn = screen.getByRole('button', { name: /Return to wandering canvas/i });
    fireEvent.click(closeBtn);

    // Modal is removed, still on canvas
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // No extra API call happened!
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
      expect(screen.getByText(/Nothing here yet\.\.\./i)).toBeInTheDocument();
      expect(screen.getByText(/Be the first person to leave a little piece of today\./i)).toBeInTheDocument();
      const shareLinks = screen.getAllByRole('link', { name: /Share your day/i });
      expect(shareLinks.length).toBeGreaterThanOrEqual(1);
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
