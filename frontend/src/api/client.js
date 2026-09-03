/**
 * API Client for Daily Wander backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Body was not JSON
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function getTodayPosts() {
  const url = `${API_BASE_URL}/api/posts/today`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
}

export async function getTodayCount() {
  const url = `${API_BASE_URL}/api/posts/today/count`;
  const response = await fetch(url, {
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
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
}
