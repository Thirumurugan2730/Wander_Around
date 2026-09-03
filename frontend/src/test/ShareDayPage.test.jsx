import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ShareDayPage from '../pages/ShareDayPage';
import * as apiClient from '../api/client';

describe('ShareDayPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and loads quota from API', async () => {
    vi.spyOn(apiClient, 'getTodayCount').mockResolvedValue({
      photosToday: 3,
      photoLimit: 100,
      photosRemaining: 97,
      textOnlyAllowed: true,
    });

    render(
      <MemoryRouter>
        <ShareDayPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /SHARE YOUR DAY/i })).toBeInTheDocument();
    expect(screen.getByText(/What did today look like\?/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/3 \/ 100 photo moments shared today/i)).toBeInTheDocument();
      expect(screen.getByText(/97 spots left/i)).toBeInTheDocument();
    });
  });

  it('rejects empty submission when neither photo nor text is provided', async () => {
    vi.spyOn(apiClient, 'getTodayCount').mockResolvedValue({
      photosToday: 1,
      photoLimit: 100,
      photosRemaining: 99,
      textOnlyAllowed: true,
    });
    const createSpy = vi.spyOn(apiClient, 'createPost');

    render(
      <MemoryRouter>
        <ShareDayPage />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /Share your day/i });
    fireEvent.click(submitBtn);

    expect(
      screen.getByText(/Please add a photo or write a thought to share your moment/i)
    ).toBeInTheDocument();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('updates text counter as user types', async () => {
    vi.spyOn(apiClient, 'getTodayCount').mockResolvedValue({
      photosToday: 0,
      photoLimit: 100,
      photosRemaining: 100,
      textOnlyAllowed: true,
    });

    render(
      <MemoryRouter>
        <ShareDayPage />
      </MemoryRouter>
    );

    const textarea = screen.getByPlaceholderText(/A few words about what made this moment yours/i);
    fireEvent.change(textarea, { target: { value: 'Hello world reflection' } });

    expect(screen.getByText('22 / 500')).toBeInTheDocument();
  });

  it('disables photo picker when photo quota is 0, but allows text-only post', async () => {
    vi.spyOn(apiClient, 'getTodayCount').mockResolvedValue({
      photosToday: 100,
      photoLimit: 100,
      photosRemaining: 0,
      textOnlyAllowed: true,
    });
    const createSpy = vi.spyOn(apiClient, 'createPost').mockResolvedValue({
      id: 99,
      text: 'Text only at quota',
      hasPhoto: false,
    });

    render(
      <MemoryRouter>
        <ShareDayPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Photo quota reached/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Today's photo limit is reached. You can still leave a text-only moment!/i)
      ).toBeInTheDocument();
    });

    // Text area is not disabled
    const textarea = screen.getByPlaceholderText(/A few words about what made this moment yours/i);
    expect(textarea).not.toBeDisabled();

    fireEvent.change(textarea, { target: { value: 'Text only at quota' } });
    const submitBtn = screen.getByRole('button', { name: /Share your day/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith({
        photo: null,
        text: 'Text only at quota',
        username: undefined,
      });
      expect(screen.getByText(/YOUR MOMENT IS OUT THERE/i)).toBeInTheDocument();
    });
  });

  it('handles 409 quota conflict response cleanly', async () => {
    vi.spyOn(apiClient, 'getTodayCount').mockResolvedValue({
      photosToday: 99,
      photoLimit: 100,
      photosRemaining: 1,
      textOnlyAllowed: true,
    });

    const error409 = new Error("Today's photo limit has been reached. You can still share a text-only moment.");
    error409.status = 409;
    vi.spyOn(apiClient, 'createPost').mockRejectedValue(error409);

    render(
      <MemoryRouter>
        <ShareDayPage />
      </MemoryRouter>
    );

    const textarea = screen.getByPlaceholderText(/A few words about what made this moment yours/i);
    fireEvent.change(textarea, { target: { value: 'Moment that raced with quota' } });

    const submitBtn = screen.getByRole('button', { name: /Share your day/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Today's photo limit has been reached. You can still leave a text-only moment/i)
      ).toBeInTheDocument();
    });
  });
});
