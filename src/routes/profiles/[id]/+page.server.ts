import type { PageServerLoad } from './$types';
import { apiGet, type Profile } from '$lib/api/backend';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const token = cookies.get('insighta_session') ?? '';
	const profile = await apiGet<{ status: string; data: Profile }>(
		`/api/profiles/${params.id}`,
		{ accessToken: token }
	);
	return { profile: profile.data };
};
