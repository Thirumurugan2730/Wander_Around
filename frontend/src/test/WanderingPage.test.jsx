import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WanderingPage from '../pages/WanderingPage';
import * as apiClient from '../api/client';

describe('WanderingPage Realistic Forest & Three Memory Birds Experience', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state then living forest canvas with three trees and memory pouches', async () => {
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
    expect(screen.getByText(/Listening to the forest breeze\.\.\./i)).toBeInTheDocument();

    // After loading finishes, canvas should show memories traveling through the trees badge
    await waitFor(() => {
      expect(screen.getByText(/3 memories traveling through the trees/i)).toBeInTheDocument();
    });

    // Verify pouches exist for the posts carried by the 3 birds
    const pouchButtons = screen.getAllByRole('button', { name: /Memory pouch carried by bird/i });
    expect(pouchButtons.length).toBeGreaterThanOrEqual(2);
  });

  it('reveals hidden memory on the same screen when pouch is clicked', async () => {
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
      expect(screen.getByText(/2 memories traveling through the trees/i)).toBeInTheDocument();
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // Click on UserA's memory pouch
    const pouchA = screen.getAllByRole('button', { name: /Memory pouch carried by bird by UserA/i })[0];
    fireEvent.click(pouchA);

    // Dialog / Reveal modal appears on same screen
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /Revealed memory carried by bird from UserA/i })).toBeInTheDocument();
      expect(screen.getByText('First moment A')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Return to the forest/i })).toBeInTheDocument();
    });

    // Close expanded view
    const closeBtn = screen.getByRole('button', { name: /Return to the forest/i });
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

  it('renders the nostalgic sun and three distinct forest trees', async () => {
    vi.spyOn(apiClient, 'getTodayPosts').mockResolvedValue([
      { id: 101, text: 'Golden afternoon', username: 'Sol', hasPhoto: false },
    ]);

    const { container } = render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/1 memory traveling through the trees/i)).toBeInTheDocument();
    });

    // Verify Nostalgic Sun elements
    expect(container.querySelector('.nostalgic-sun-container')).toBeInTheDocument();
    expect(container.querySelector('.sun-core-disc')).toBeInTheDocument();

    // Verify 3 distinct trees
    expect(container.querySelector('.tree-left-container')).toBeInTheDocument();
    expect(container.querySelector('.tree-center-container')).toBeInTheDocument();
    expect(container.querySelector('.tree-right-container')).toBeInTheDocument();

    // Verify top-only clouds container
    expect(container.querySelector('.top-sky-clouds-container')).toBeInTheDocument();
  });
});
