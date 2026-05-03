// nav.js — injects the navigation bar into every protected page.
import { Auth } from './auth.js';

export function renderNav() {
  const username = Auth.getUsername();
  const role     = Auth.getRole();
  const isAdmin  = Auth.isAdmin();

  const nav = document.createElement('nav');
  nav.innerHTML = `
    <a href="/dashboard.html" class="brand">⚡ Insighta Labs+</a>
    <div class="nav-links">
      <a href="/dashboard.html">Dashboard</a>
      <a href="/profiles.html">Profiles</a>
      <a href="/search.html">Search</a>
      <a href="/account.html">Account</a>
    </div>
    <div class="nav-right">
      <span class="role-badge ${isAdmin ? 'admin' : ''}">${role}</span>
      <span class="username">@${username}</span>
      <button class="logout-btn" id="logout-btn">Log out</button>
    </div>
  `;
  document.body.prepend(nav);

  document.getElementById('logout-btn').addEventListener('click', () => Auth.logout());
}

export const navCSS = `
  nav {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 0 2rem;
    height: 56px;
    background: #1a1a2e;
    color: #fff;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .brand {
    font-weight: 700;
    font-size: 1rem;
    color: #fff;
    text-decoration: none;
    white-space: nowrap;
  }
  .nav-links {
    display: flex;
    gap: 1.5rem;
    flex: 1;
  }
  .nav-links a {
    color: #ccc;
    text-decoration: none;
    font-size: 0.9rem;
  }
  .nav-links a:hover { color: #fff; }
  .nav-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.85rem;
  }
  .username { color: #aaa; }
  .role-badge {
    background: #2a2a4a;
    color: #a8dadc;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .role-badge.admin { background: #3a1a2e; color: #f4a261; }
  .logout-btn {
    background: none;
    border: 1px solid #444;
    color: #ccc;
    padding: 4px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
  }
  .logout-btn:hover { border-color: #888; color: #fff; }
`;
