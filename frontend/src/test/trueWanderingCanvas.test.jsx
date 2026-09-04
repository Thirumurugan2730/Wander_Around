import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WanderingPage from '../pages/WanderingPage';
import * as apiClient from '../api/client';

describe('Nostalgic Forest & Memory Bird Comprehensive Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles single moment (1 memory) layout gracefully', async () => {
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
      expect(screen.getByText(/1 memory living in today's breeze/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Solo quiet morning meditation')).toBeInTheDocument();
  });

  it('handles multiple moments drifting through forest and carried by bird', async () => {
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
      expect(screen.getByText(/12 memories living in today's breeze/i)).toBeInTheDocument();
    });

    // Verify presence of text notes and bird carrier
    expect(screen.getByText('Moment number 1 from today')).toBeInTheDocument();
  });

  it('renders all moment types correctly: photo-only, text-only, photo+text', async () => {
    const variedPosts = [
      { id: 1, text: 'Sunset at the lake with warm coffee.', username: 'Traveler', hasPhoto: true, imagePath: 'lake.webp' }, // Photo + text
      { id: 2, text: 'Pure text thoughts without any photo.', username: 'Writer', hasPhoto: false }, // Text-only
    ];
    vi.spyOn(apiClient, 'getTodayPosts').mockResolvedValue(variedPosts);

    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/2 memories living in today's breeze/i)).toBeInTheDocument();
    });

    // Check Text-only
    expect(screen.getByText('Pure text thoughts without any photo.')).toBeInTheDocument();
    expect(screen.getByText('— Writer')).toBeInTheDocument();

    // Check Photo + text carried by bird
    expect(screen.getByText('Sunset at the lake with warm coffee.')).toBeInTheDocument();
    const photoMemoryCard = screen.getByRole('button', { name: /Photo memory carried by bird by Traveler/i });
    expect(photoMemoryCard).toBeInTheDocument();
  });

  it('shows full untruncated text and uncropped photo when memory expands', async () => {
    const longTextPost = [
      {
        id: 99,
        text: 'This is a long and detailed memory of walking through the botanical gardens in the gentle morning rain. Every single word of this story must remain visible without truncation, ellipsis, or line clamping when expanded.',
        username: 'Storyteller',
        hasPhoto: true,
        imagePath: 'botanical.webp',
      },
    ];
    vi.spyOn(apiClient, 'getTodayPosts').mockResolvedValue(longTextPost);

    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/1 memory living in today's breeze/i)).toBeInTheDocument();
    });

    const card = screen.getByRole('button', { name: /Photo memory carried by bird by Storyteller/i });
    fireEvent.click(card);

    // Verify modal is open
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Verify the complete untruncated text is in the expanded view
    const expandedCaption = dialog.querySelector('.expanded-caption-text');
    expect(expandedCaption).toBeInTheDocument();
    expect(expandedCaption.textContent).toContain('This is a long and detailed memory of walking through the botanical gardens in the gentle morning rain.');

    // Verify full photo element is present with contain class
    const img = dialog.querySelector('.expanded-full-photo');
    expect(img).toBeInTheDocument();
  });

  it('pauses background canvas while an expanded memory is active', async () => {
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
      expect(screen.getByText(/2 memories living in today's breeze/i)).toBeInTheDocument();
    });

    const canvas = screen.getByLabelText(/Interactive forest memories/i);
    expect(canvas).not.toHaveClass('is-paused');

    // Click to expand
    const card = screen.getByRole('button', { name: /Handwritten memory drifting through forest by User1/i });
    fireEvent.click(card);

    // Canvas is now paused
    expect(canvas).toHaveClass('is-paused');

    // Close
    const closeBtn = screen.getByRole('button', { name: /Return to the sky/i });
    fireEvent.click(closeBtn);

    // Canvas is unpaused
    expect(canvas).not.toHaveClass('is-paused');
  });
});
