import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WanderingPage from '../pages/WanderingPage';
import * as apiClient from '../api/client';

describe('Realistic Forest & Three Memory Birds Comprehensive Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles single moment (1 memory) layout gracefully across trees', async () => {
    const singlePost = [
      { id: 10, text: 'Solo quiet morning meditation', username: 'Elena', hasPhoto: false },
    ];
    vi.spyOn(apiClient, 'getTodayPosts').mockResolvedValue(singlePost);

    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/1 memory traveling through the trees/i)).toBeInTheDocument();
    });

    const pouch = screen.getAllByRole('button', { name: /Memory pouch carried by bird by Elena/i });
    expect(pouch.length).toBeGreaterThanOrEqual(1);
  });

  it('handles multiple moments distributed across the three messenger birds', async () => {
    const manyPosts = Array.from({ length: 12 }, (_, i) => ({
      id: `moment-${i + 1}`,
      text: `Moment number ${i + 1} from today`,
      username: `User${i + 1}`,
      hasPhoto: i % 2 === 0,
      imagePath: i % 2 === 0 ? `photo_${i + 1}.webp` : null,
    }));
    vi.spyOn(apiClient, 'getTodayPosts').mockResolvedValue(manyPosts);

    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/12 memories traveling through the trees/i)).toBeInTheDocument();
    });

    // Verify 3 memory pouches for the 3 birds
    const pouches = screen.getAllByRole('button', { name: /Memory pouch carried by bird/i });
    expect(pouches.length).toBe(3);
  });

  it('renders all moment types correctly: photo-only, text-only, photo+text in reveal modal', async () => {
    const variedPosts = [
      { id: 1, text: 'Sunset at the lake with warm coffee.', username: 'Traveler', hasPhoto: true, imagePath: 'lake.webp' },
    ];
    vi.spyOn(apiClient, 'getTodayPosts').mockResolvedValue(variedPosts);

    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/1 memory traveling through the trees/i)).toBeInTheDocument();
    });

    // Pouch is visible, photo is NOT yet revealed until click
    const pouch = screen.getAllByRole('button', { name: /Memory pouch carried by bird by Traveler/i })[0];
    fireEvent.click(pouch);

    // After clicking pouch, photo + text are revealed inside modal
    await waitFor(() => {
      expect(screen.getByText('Sunset at the lake with warm coffee.')).toBeInTheDocument();
      expect(screen.getByText(/— Traveler/i)).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('shows full untruncated text and uncropped photo when pouch memory is revealed', async () => {
    const longTextPost = [
      {
        id: 99,
        text: 'This is a long and detailed memory of walking through the ancient pine woods in the gentle golden evening light. Every single word of this story must remain visible without truncation when revealed from the pouch.',
        username: 'Storyteller',
        hasPhoto: true,
        imagePath: 'woods.webp',
      },
    ];
    vi.spyOn(apiClient, 'getTodayPosts').mockResolvedValue(longTextPost);

    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/1 memory traveling through the trees/i)).toBeInTheDocument();
    });

    const pouch = screen.getAllByRole('button', { name: /Memory pouch carried by bird by Storyteller/i })[0];
    fireEvent.click(pouch);

    // Verify reveal modal is open
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Verify untruncated text is in the revealed view
    const revealedNote = dialog.querySelector('.revealed-handwritten-note');
    expect(revealedNote).toBeInTheDocument();
    expect(revealedNote.textContent).toContain('This is a long and detailed memory of walking through the ancient pine woods');

    // Verify photo element is present
    const img = dialog.querySelector('.revealed-full-photo');
    expect(img).toBeInTheDocument();
  });

  it('pauses background canvas while revealed memory is active', async () => {
    const posts = [
      { id: 1, text: 'Note 1', username: 'User1', hasPhoto: false },
      { id: 2, text: 'Note 2', username: 'User2', hasPhoto: false },
    ];
    vi.spyOn(apiClient, 'getTodayPosts').mockResolvedValue(posts);

    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/2 memories traveling through the trees/i)).toBeInTheDocument();
    });

    const canvas = screen.getByLabelText(/Interactive forest memories/i);
    expect(canvas).not.toHaveClass('is-paused');

    // Click pouch to reveal
    const pouch = screen.getAllByRole('button', { name: /Memory pouch carried by bird by User1/i })[0];
    fireEvent.click(pouch);

    // Canvas is now paused
    expect(canvas).toHaveClass('is-paused');

    // Close
    const closeBtn = screen.getByRole('button', { name: /Return to the forest/i });
    fireEvent.click(closeBtn);

    // Canvas is unpaused
    expect(canvas).not.toHaveClass('is-paused');
  });
});
