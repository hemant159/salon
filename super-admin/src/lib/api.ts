const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Wrapper for fetch that automatically attaches the Super Admin JWT token.
 */
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // If unauthorized, clear token and redirect to login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }

  // Handle empty responses (like 204 No Content or simple DELETEs)
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
