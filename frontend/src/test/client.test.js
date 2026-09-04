import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPost, getTodayPosts, getTodayCount } from '../api/client';

describe('API Client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches today posts successfully from /api/posts/today', async () => {
    const fakePosts = [{ id: 1, text: 'Hello' }];
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => fakePosts,
    });

    const result = await getTodayPosts();
    expect(result).toEqual(fakePosts);
  });

  it('fetches today count successfully from /api/posts/today/count', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ count: 5, remaining: 95 }),
    });

    const result = await getTodayCount();
    expect(result).toEqual({ count: 5, remaining: 95 });
  });

  it('constructs correct FormData for photo + text post and sends to /api/posts', async () => {
    const fakeResponse = {
      id: 101,
      username: 'Thiru',
      text: 'Sunset moment',
      imagePath: '2026-09-03/fake.webp',
      hasPhoto: true,
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => fakeResponse,
    });

    const file = new File(['dummy content'], 'photo.jpg', { type: 'image/jpeg' });
    const result = await createPost({
      photo: file,
      text: 'Sunset moment',
      username: 'Thiru',
    });

    expect(result).toEqual(fakeResponse);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const [url, options] = fetchSpy.mock.calls[0];
    expect(url).toContain('/api/posts');
    expect(options.method).toBe('POST');
    expect(options.body).toBeInstanceOf(FormData);

    const formData = options.body;
    expect(formData.get('text')).toBe('Sunset moment');
    expect(formData.get('username')).toBe('Thiru');
    expect(formData.get('photo')).toBe(file);
  });

  it('constructs correct FormData for text-only post without photo field', async () => {
    const fakeResponse = {
      id: 102,
      username: 'Anonymous',
      text: 'Quiet thought',
      imagePath: null,
      hasPhoto: false,
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => fakeResponse,
    });

    const result = await createPost({
      photo: null,
      text: 'Quiet thought',
      username: '',
    });

    expect(result).toEqual(fakeResponse);
    const [, options] = fetchSpy.mock.calls[0];
    const formData = options.body;
    expect(formData.get('photo')).toBeNull();
    expect(formData.get('text')).toBe('Quiet thought');
    expect(formData.get('username')).toBeNull();
  });

  it('throws error with status when response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({ message: "Today's photo limit has been reached." }),
    });

    await expect(
      createPost({ photo: null, text: 'Test' })
    ).rejects.toMatchObject({
      status: 409,
      message: "Today's photo limit has been reached.",
    });
  });
});
