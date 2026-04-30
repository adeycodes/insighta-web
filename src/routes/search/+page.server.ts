import type { PageServerLoad } from './$types';
import { apiGet, type PaginatedProfiles } from '$lib/api/backend';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const token = cookies.get('insighta_session') ?? '';
	const q = url.searchParams.get('q') ?? '';

	if (!q.trim()) {
		return { profiles: null, q: '' };
	}

	const params = new URLSearchParams(url.searchParams);
	const profiles = await apiGet<PaginatedProfiles>(
		'/api/profiles/search?' + params.toString(),
		{ accessToken: token }
	).catch(() => null);

	return { profiles, q };
};
