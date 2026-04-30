import type { Handle, RequestEvent } from '@sveltejs/kit';
import { BACKEND_URL } from '$env/static/private';

const PUBLIC_ROUTES = ['/', '/auth/callback', '/auth/logout'];

export const handle: Handle = async ({ event, resolve }) => {
	const sessionCookie = event.cookies.get('insighta_session');
	const refreshCookie = event.cookies.get('insighta_refresh');

	event.locals.user = null;

	if (sessionCookie) {
		// Fetch the user's profile using the current session token.
		const user = await fetchUser(sessionCookie);

		if (user) {
			event.locals.user = user;
		} else if (refreshCookie) {
			// Access token expired — attempt a silent refresh.
			const refreshed = await attemptRefresh(refreshCookie, event.cookies);
			if (refreshed) {
				event.locals.user = await fetchUser(refreshed.accessToken);
			}
		}
	}

	// Redirect unauthenticated users away from protected routes.
	const path = event.url.pathname;
	const isPublic = PUBLIC_ROUTES.some((r) => path === r || path.startsWith(r));

	if (!isPublic && !event.locals.user) {
		return new Response(null, {
			status: 302,
			headers: { Location: '/' }
		});
	}

	return resolve(event);
};

async function fetchUser(accessToken: string) {
	try {
		const resp = await fetch(`${BACKEND_URL}/auth/me`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'X-API-Version': '1'
			}
		});
		if (!resp.ok) return null;
		const json = await resp.json();
		return json.data ?? null;
	} catch {
		return null;
	}
}

interface RefreshResult {
	accessToken: string;
	refreshToken: string;
}

async function attemptRefresh(
	refreshToken: string,
	cookies: RequestEvent['cookies']
): Promise<RefreshResult | null> {
	try {
		const resp = await fetch(`${BACKEND_URL}/auth/refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refresh_token: refreshToken })
		});

		if (!resp.ok) {
			// Refresh failed — clear stale cookies.
			cookies.delete('insighta_session', { path: '/' });
			cookies.delete('insighta_refresh', { path: '/' });
			cookies.delete('csrf_token', { path: '/' });
			return null;
		}

		const json = await resp.json();
		const isProd = process.env.NODE_ENV === 'production';

		cookies.set('insighta_session', json.access_token, {
			path: '/',
			httpOnly: true,
			secure: isProd,
			sameSite: 'lax',
			maxAge: 180 // 3 minutes
		});

		cookies.set('insighta_refresh', json.refresh_token, {
			path: '/auth/refresh',
			httpOnly: true,
			secure: isProd,
			sameSite: 'lax',
			maxAge: 300 // 5 minutes
		});

		return {
			accessToken: json.access_token,
			refreshToken: json.refresh_token
		};
	} catch {
		return null;
	}
}
