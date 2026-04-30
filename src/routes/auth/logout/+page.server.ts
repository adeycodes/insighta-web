import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { BACKEND_URL } from '$env/static/private';

export const actions: Actions = {
	default: async ({ cookies }) => {
		const refreshToken = cookies.get('insighta_refresh');

		// Tell the backend to invalidate the refresh token.
		if (refreshToken) {
			await fetch(`${BACKEND_URL}/auth/logout`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refresh_token: refreshToken })
			}).catch(() => {
				// Best-effort — still clear local cookies even if this fails.
			});
		}

		cookies.delete('insighta_session', { path: '/' });
		cookies.delete('insighta_refresh', { path: '/' });
		cookies.delete('csrf_token', { path: '/' });

		throw redirect(302, '/');
	}
};
