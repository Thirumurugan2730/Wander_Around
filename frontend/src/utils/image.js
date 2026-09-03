/**
 * Resolves a storage image path to a full CDN URL.
 * Keeps storage URL details isolated from UI components.
 */
export function resolveImageUrl(imagePath) {
  if (!imagePath) return null;

  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('blob:') ||
    imagePath.startsWith('data:')
  ) {
    return imagePath;
  }

  const storageBase =
    import.meta.env.VITE_SUPABASE_STORAGE_BASE ||
    'https://hrtgvolkklrxphhozzqm.supabase.co/storage/v1/object/public/moments';

  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${storageBase}/${cleanPath}`;
}

export function formatTimeAgo(isoString) {
  if (!isoString) return 'today';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'today';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'today';
  }
}
