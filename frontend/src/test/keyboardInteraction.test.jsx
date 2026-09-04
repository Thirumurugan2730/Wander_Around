import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WanderingPage from '../pages/WanderingPage';
import * as apiClient from '../api/client';

describe('Wandering Through Clouds Keyboard Accessibility & Interaction', () => {
  const mockPosts = [
    { id: 101, text: 'Morning coffee', username: 'Thiru', hasPhoto: false },
    { id: 102, text: 'Quiet train ride', username: 'Maya', hasPhoto: false },
    { id: 103, text: 'Rain on the glass', username: 'Sam', hasPhoto: true, imagePath: 'rain.webp' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(apiClient, 'getTodayPosts').mockResolvedValue(mockPosts);
  });

  it('allows opening moments via Enter key on focused cloud', async () => {
    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/drifting through today/i)).toBeInTheDocument();
    });

    const card = screen.getByRole('button', { name: /Text cloud memory by Thiru/i });
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /Expanded memory by Thiru/i })).toBeInTheDocument();
    });
  });

  it('allows opening moments via Space key on focused cloud', async () => {
    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/drifting through today/i)).toBeInTheDocument();
    });

    const card = screen.getByRole('button', { name: /Text cloud memory by Maya/i });
    fireEvent.keyDown(card, { key: ' ', code: 'Space' });

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /Expanded memory by Maya/i })).toBeInTheDocument();
    });
  });

  it('closes expanded moment on Escape key press', async () => {
    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/drifting through today/i)).toBeInTheDocument();
    });

    const card = screen.getByRole('button', { name: /Photo cloud memory by Sam/i });
    fireEvent.click(card);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Press Escape
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes expanded moment when clicking the backdrop', async () => {
    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/drifting through today/i)).toBeInTheDocument();
    });

    const card = screen.getByRole('button', { name: /Text cloud memory by Thiru/i });
    fireEvent.click(card);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Click backdrop (the dialog container itself)
    fireEvent.click(dialog);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
