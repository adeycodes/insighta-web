// api.js — typed wrappers around every backend endpoint.
// Automatically retries with a refreshed token on 401.

import { Auth, BACKEND } from './auth.js';

async function request(method, path, body = null) {
  const token = Auth.getAccessToken();

  const headers = {
    'Authorization': `Bearer ${token}`,
    'X-API-Version': '1',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  let resp = await fetch(BACKEND + path, options);

  // Silent token refresh on 401 then retry once.
  if (resp.status === 401) {
    const ok = await Auth.refresh();
    if (!ok) {
      Auth.clear();
      window.location.href = '/index.html';
      return null;
    }
    headers['Authorization'] = `Bearer ${Auth.getAccessToken()}`;
    resp = await fetch(BACKEND + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  }

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ message: `HTTP ${resp.status}` }));
    throw new Error(err.message || 'Request failed');
  }

  // 204 No Content
  if (resp.status === 204) return null;

  return resp.json();
}

export const API = {
  // Auth
  getMe: ()                       => request('GET', '/auth/me'),

  // Profiles
  listProfiles: (params = {})     => request('GET', '/api/profiles?' + new URLSearchParams(params).toString()),
  getProfile:   (id)              => request('GET', `/api/profiles/${id}`),
  searchProfiles: (params = {})   => request('GET', '/api/profiles/search?' + new URLSearchParams(params).toString()),
  createProfile: (name)           => request('POST', '/api/profiles', { name }),
  deleteProfile: (id)             => request('DELETE', `/api/profiles/${id}`),

  // CSV export — returns raw response for download
  async exportCSV(params = {}) {
    const token = Auth.getAccessToken();
    params.format = 'csv';
    const resp = await fetch(BACKEND + '/api/profiles/export?' + new URLSearchParams(params).toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-API-Version': '1',
      },
    });
    if (!resp.ok) throw new Error('Export failed');
    const blob = await resp.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `profiles_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },
};
