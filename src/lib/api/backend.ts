import { BACKEND_URL } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';

interface RequestOptions {
	accessToken: string;
	csrfToken?: string;
}

// apiGet is used in SvelteKit load() functions (server-side only).
export async function apiGet<T>(path: string, opts: RequestOptions): Promise<T> {
	const resp = await fetch(`${BACKEND_URL}${path}`, {
		headers: {
			Authorization: `Bearer ${opts.accessToken}`,
			'X-API-Version': '1',
			Accept: 'application/json'
		}
	});

	if (resp.status === 401) {
		// Session expired and refresh didn't catch it — back to login.
		throw redirect(302, '/');
	}
	if (!resp.ok) {
		const body = await resp.json().catch(() => ({ message: 'Unknown error' }));
		throw error(resp.status, body.message ?? 'Request failed');
	}

	return resp.json() as Promise<T>;
}

// apiPost is used in SvelteKit form actions (server-side only).
export async function apiPost<T>(
	path: string,
	body: unknown,
	opts: RequestOptions
): Promise<T> {
	const resp = await fetch(`${BACKEND_URL}${path}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${opts.accessToken}`,
			'X-API-Version': '1',
			'Content-Type': 'application/json',
			...(opts.csrfToken ? { 'X-CSRF-Token': opts.csrfToken } : {})
		},
		body: JSON.stringify(body)
	});

	if (resp.status === 401) {
		throw redirect(302, '/');
	}
	if (!resp.ok) {
		const json = await resp.json().catch(() => ({ message: 'Unknown error' }));
		throw error(resp.status, json.message ?? 'Request failed');
	}

	return resp.json() as Promise<T>;
}

// apiDelete is used in SvelteKit form actions (server-side only).
export async function apiDelete(path: string, opts: RequestOptions): Promise<void> {
	const resp = await fetch(`${BACKEND_URL}${path}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${opts.accessToken}`,
			'X-API-Version': '1',
			...(opts.csrfToken ? { 'X-CSRF-Token': opts.csrfToken } : {})
		}
	});

	if (resp.status === 401) {
		throw redirect(302, '/');
	}
	if (resp.status !== 204 && !resp.ok) {
		const json = await resp.json().catch(() => ({ message: 'Unknown error' }));
		throw error(resp.status, json.message ?? 'Delete failed');
	}
}

export type Profile = {
	id: string;
	name: string;
	gender: string;
	gender_probability: number;
	sample_size: number;
	age: number;
	age_group: string;
	country_id: string;
	country_name: string;
	country_probability: number;
	created_at: string;
};

export type PaginatedProfiles = {
	status: string;
	page: number;
	limit: number;
	total: number;
	total_pages: number;
	links: { self: string; next: string | null; prev: string | null };
	data: Profile[];
};
