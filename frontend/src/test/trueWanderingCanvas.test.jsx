import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WanderingPage from '../pages/WanderingPage';
import * as apiClient from '../api/client';

describe('True Wandering Canvas Comprehensive Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles single moment (1 moment) layout gracefully', async () => {
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
      expect(screen.getByText(/1 memory floating through today/i)).toBeInTheDocument();
    });

    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(1);
    expect(screen.getByText('Solo quiet morning meditation')).toBeInTheDocument();
  });

  it('handles 20+ moments simultaneously on the living canvas', async () => {
    const manyPosts = Array.from({ length: 24 }, (_, i) => ({
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
      expect(screen.getByText(/24 memories floating through today/i)).toBeInTheDocument();
    });

    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(24);

    // Verify all 24 cards are rendered and discoverable
    expect(screen.getByText('Moment number 1 from today')).toBeInTheDocument();
    expect(screen.getByText('Moment number 24 from today')).toBeInTheDocument();
  });

  it('renders all moment types correctly: photo-only, text-only, photo+text', async () => {
    const variedPosts = [
      { id: 1, text: null, username: 'Photographer', hasPhoto: true, imagePath: 'scenery.webp' }, // Photo-only
      { id: 2, text: 'Pure text thoughts without any photo.', username: 'Writer', hasPhoto: false }, // Text-only
      { id: 3, text: 'Sunset at the lake with warm coffee.', username: 'Traveler', hasPhoto: true, imagePath: 'lake.webp' }, // Photo + text
    ];
    vi.spyOn(apiClient, 'getTodayPosts').mockResolvedValue(variedPosts);

    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/3 memories floating through today/i)).toBeInTheDocument();
    });

    // Check Text-only
    expect(screen.getByText('Pure text thoughts without any photo.')).toBeInTheDocument();
    expect(screen.getByText('— Writer')).toBeInTheDocument();

    // Check Photo-only
    const photoOnlyCard = screen.getByRole('button', { name: /Photo memory by Photographer/i });
    expect(photoOnlyCard).toBeInTheDocument();

    // Check Photo + text
    expect(screen.getByText('Sunset at the lake with warm coffee.')).toBeInTheDocument();
  });

  it('shows full untruncated text and uncropped photo when moment expands', async () => {
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
      expect(screen.getByText(/1 memory floating through today/i)).toBeInTheDocument();
    });

    const card = screen.getByRole('button', { name: /Photo memory by Storyteller/i });
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

  it('pauses background canvas while an expanded moment is active', async () => {
    const posts = [
      { id: 1, text: 'Card 1', username: 'User1', hasPhoto: false },
      { id: 2, text: 'Card 2', username: 'User2', hasPhoto: false },
    ];
    vi.spyOn(apiClient, 'getTodayPosts').mockResolvedValue(posts);

    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/2 memories floating through today/i)).toBeInTheDocument();
    });

    const canvas = screen.getByLabelText(/Interactive floating memories/i);
    expect(canvas).not.toHaveClass('is-paused');

    // Click to expand
    const card = screen.getByRole('button', { name: /Text memory by User1/i });
    fireEvent.click(card);

    // Canvas is now paused
    expect(canvas).toHaveClass('is-paused');

    // Close
    const closeBtn = screen.getByRole('button', { name: /Return to wandering canvas/i });
    fireEvent.click(closeBtn);

    // Canvas is unpaused
    expect(canvas).not.toHaveClass('is-paused');
  });
});
