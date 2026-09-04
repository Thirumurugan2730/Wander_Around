/**
 * API Client for Daily Wander backend.
 */

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
// Strip trailing slashes to avoid double slashes like '//api/posts/today'
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '');

/**
 * Robust fetch wrapper with timeout support.
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

async function handleResponse(response) {
  let contentType = '';
  if (response.headers && typeof response.headers.get === 'function') {
    contentType = response.headers.get('content-type') || '';
  }

  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}`;
    try {
      if (typeof response.json === 'function') {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (typeof response.text === 'function') {
        const textData = await response.text();
        if (textData) errorMessage = textData.slice(0, 200);
      }
    } catch {
      // Body could not be read
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  if (typeof response.json === 'function') {
    return response.json();
  }

  if (typeof response.text === 'function') {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error('Expected JSON response from server.');
    }
  }

  return response;
}

export async function getTodayPosts() {
  const url = `${API_BASE_URL}/api/posts/today`;
  const response = await fetchWithTimeout(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
}

export async function getTodayCount() {
  const url = `${API_BASE_URL}/api/posts/today/count`;
  const response = await fetchWithTimeout(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
}

export async function createPost({ photo, text, username }) {
  const url = `${API_BASE_URL}/api/posts`;
  const formData = new FormData();

  if (photo) {
    formData.append('photo', photo);
  }
  if (text && text.trim()) {
    formData.append('text', text.trim());
  }
  if (username && username.trim()) {
    formData.append('username', username.trim());
  }

  // Note: Do NOT manually set Content-Type header.
  // The browser automatically sets Content-Type: multipart/form-data; boundary=...
  const response = await fetchWithTimeout(url, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
    },
  }, 30000); // 30s timeout for photo upload
  return handleResponse(response);
}
