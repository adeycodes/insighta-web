// auth.js — handles all credential management for the web portal.
// Tokens are stored in localStorage. The CSRF token comes from the backend
// as a query param after OAuth and is stored separately.

const BACKEND = 'https://insighta-backend.vercel.app';

export const Auth = {
  save(data) {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    if (data.username) localStorage.setItem('username', data.username);
    if (data.role)     localStorage.setItem('role', data.role);
  },

  clear() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  },

  getAccessToken()  { return localStorage.getItem('access_token'); },
  getRefreshToken() { return localStorage.getItem('refresh_token'); },
  getUsername()     { return localStorage.getItem('username') || ''; },
  getRole()         { return localStorage.getItem('role') || 'analyst'; },
  isAdmin()         { return Auth.getRole() === 'admin'; },

  isLoggedIn() {
    return !!Auth.getAccessToken();
  },

  // Silently exchange the refresh token for a new pair.
  // Returns true if successful, false if the user must log in again.
  async refresh() {
    const refreshToken = Auth.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const resp = await fetch(`${BACKEND}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!resp.ok) {
        Auth.clear();
        return false;
      }

      const data = await resp.json();
      Auth.save(data);
      return true;
    } catch {
      return false;
    }
  },

  async logout() {
    const refreshToken = Auth.getRefreshToken();
    if (refreshToken) {
      await fetch(`${BACKEND}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }).catch(() => {});
    }
    Auth.clear();
    window.location.href = '/index.html';
  },

  // Call on every protected page. Redirects to login if not authenticated.
  requireAuth() {
    if (!Auth.isLoggedIn()) {
      window.location.href = '/index.html';
      return false;
    }
    return true;
  },
};

export { BACKEND };
