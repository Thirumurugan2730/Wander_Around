import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WanderingPage from '../pages/WanderingPage';
import * as apiClient from '../api/client';

describe('Realistic Forest & Three Memory Birds Keyboard Accessibility & Interaction', () => {
  const mockPosts = [
    { id: 101, text: 'Morning coffee', username: 'Thiru', hasPhoto: false },
    { id: 102, text: 'Quiet train ride', username: 'Maya', hasPhoto: false },
    { id: 103, text: 'Rain on the glass', username: 'Sam', hasPhoto: true, imagePath: 'rain.webp' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(apiClient, 'getTodayPosts').mockResolvedValue(mockPosts);
  });

  it('allows opening memory pouch via Enter key on focused pouch', async () => {
    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/traveling through the trees/i)).toBeInTheDocument();
    });

    const pouch = screen.getAllByRole('button', { name: /Memory pouch carried by bird by Thiru/i })[0];
    fireEvent.keyDown(pouch, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /Revealed memory carried by bird from Thiru/i })).toBeInTheDocument();
      expect(screen.getByText('Morning coffee')).toBeInTheDocument();
    });
  });

  it('allows opening memory pouch via Space key on focused pouch', async () => {
    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/traveling through the trees/i)).toBeInTheDocument();
    });

    const pouch = screen.getAllByRole('button', { name: /Memory pouch carried by bird by Maya/i })[0];
    fireEvent.keyDown(pouch, { key: ' ', code: 'Space' });

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /Revealed memory carried by bird from Maya/i })).toBeInTheDocument();
      expect(screen.getByText('Quiet train ride')).toBeInTheDocument();
    });
  });

  it('closes revealed memory on Escape key press', async () => {
    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/traveling through the trees/i)).toBeInTheDocument();
    });

    const pouch = screen.getAllByRole('button', { name: /Memory pouch carried by bird by Sam/i })[0];
    fireEvent.click(pouch);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Press Escape
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes revealed memory when clicking the backdrop', async () => {
    render(
      <MemoryRouter>
        <WanderingPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/traveling through the trees/i)).toBeInTheDocument();
    });

    const pouch = screen.getAllByRole('button', { name: /Memory pouch carried by bird by Thiru/i })[0];
    fireEvent.click(pouch);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Click backdrop
    fireEvent.click(dialog);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
