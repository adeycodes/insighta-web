import type { PageServerLoad, Actions } from './$types';
import { apiGet, apiPost, apiDelete, type PaginatedProfiles } from '$lib/api/backend';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const token = cookies.get('insighta_session') ?? '';

	// Forward all query params (filters, sort, page) to the backend.
	const params = url.searchParams.toString();
	const path = `/api/profiles${params ? '?' + params : ''}`;

	const profiles = await apiGet<PaginatedProfiles>(path, { accessToken: token });

	return { profiles, query: Object.fromEntries(url.searchParams) };
};

export const actions: Actions = {
	create: async ({ request, cookies }) => {
		const token = cookies.get('insighta_session') ?? '';
		const csrfToken = cookies.get('csrf_token') ?? '';
		const form = await request.formData();
		const name = (form.get('name') as string)?.trim();

		if (!name) {
			return fail(400, { error: 'Name is required' });
		}

		try {
			await apiPost('/api/profiles', { name }, { accessToken: token, csrfToken });
			return { success: true };
		} catch (e: any) {
			return fail(400, { error: e.body?.message ?? 'Failed to create profile' });
		}
	},

	delete: async ({ request, cookies }) => {
		const token = cookies.get('insighta_session') ?? '';
		const csrfToken = cookies.get('csrf_token') ?? '';
		const form = await request.formData();
		const id = form.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Profile ID is required' });
		}

		try {
			await apiDelete(`/api/profiles/${id}`, { accessToken: token, csrfToken });
			return { success: true };
		} catch (e: any) {
			return fail(400, { error: e.body?.message ?? 'Failed to delete profile' });
		}
	}
};
