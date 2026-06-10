// login/register/src/services/auth.js

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Turn mock auth on/off using a Vite env var
// In Render, you can set: VITE_USE_MOCK_AUTH=true
export const USE_MOCK_AUTH = (import.meta.env.VITE_USE_MOCK_AUTH || '').toLowerCase() === 'true';

export async function login({ email, password }) {
  // MOCK MODE
  if (USE_MOCK_AUTH) {
    await sleep(600);

    // Option A: accept any non-empty credentials
    if (!email || !password) {
      return { ok: false, status: 400, errors: ['Email and password are required (mock mode).'] };
    }

    // Fake user object
    const mockUser = {
      id: 'mock-user',
      name: 'Mock User',
      email,
      confirmed: true,
    };

    return { ok: true, status: 200, user: mockUser };
  }

  // REAL MODE (unchanged behavior)
  const response = await fetch(
    'https://itse-2374-app-4-back-s4gw.onrender.com/api/users/login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    }
  );

  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, ...data };
}