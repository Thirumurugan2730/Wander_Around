import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WanderingPage from '../pages/WanderingPage';
import * as apiClient from '../api/client';

describe('WanderingPage Nostalgic Forest & Memory Bird Experience', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state then living forest canvas with carrier bird and drifting notes', async () => {
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

    // After loading finishes, canvas should show living memories badge
    await waitFor(() => {
      expect(screen.getByText(/3 memories living in today's breeze/i)).toBeInTheDocument();
    });

    // Verify memories exist: 2 drifting text notes + 1 bird photo print
    expect(screen.getByText('Morning reflections')).toBeInTheDocument();
    expect(screen.getByText('Sunset glow')).toBeInTheDocument();
    expect(screen.getByText('Coffee with rain')).toBeInTheDocument();
  });

  it('expands selected memory on the same screen when clicked without extra API calls', async () => {
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
      expect(screen.getByText(/2 memories living in today's breeze/i)).toBeInTheDocument();
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // Click on First moment note
    const firstCard = screen.getByRole('button', { name: /Handwritten memory drifting through forest by UserA/i });
    fireEvent.click(firstCard);

    // Dialog / Expanded modal appears on same screen
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /Expanded memory by UserA/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Return to the sky/i })).toBeInTheDocument();
    });

    // Close expanded view
    const closeBtn = screen.getByRole('button', { name: /Return to the sky/i });
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

  it('renders the nostalgic sun and living forest tree elements', async () => {
    vi.spyOn(apiClient, 'getTodayPosts').mockResolvedValue([
      { id: 101, text: 'Golden afternoon', username: 'Sol', hasPhoto: false },
    ]);

    const { container } = render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Golden afternoon')).toBeInTheDocument();
    });

    // Verify Nostalgic Sun elements
    expect(container.querySelector('.nostalgic-sun-container')).toBeInTheDocument();
    expect(container.querySelector('.sun-core-disc')).toBeInTheDocument();
    expect(container.querySelector('.sun-outer-corona')).toBeInTheDocument();

    // Verify Forest Scene & Tree
    expect(container.querySelector('.forest-main-tree-container')).toBeInTheDocument();
    expect(container.querySelector('.forest-tree-svg')).toBeInTheDocument();
    expect(container.querySelector('.forest-wind-particles')).toBeInTheDocument();
  });
});
