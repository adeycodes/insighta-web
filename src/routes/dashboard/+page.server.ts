import type { PageServerLoad } from './$types';
import { apiGet, type PaginatedProfiles } from '$lib/api/backend';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	const token = cookies.get('insighta_session') ?? '';

	const [recent, stats] = await Promise.all([
		apiGet<PaginatedProfiles>('/api/profiles?limit=5&sort_by=created_at&order=desc', {
			accessToken: token
		}),
		apiGet<PaginatedProfiles>('/api/profiles?limit=1', { accessToken: token })
	]);

	return {
		user: locals.user,
		recentProfiles: recent.data,
		totalProfiles: stats.total
	};
};
