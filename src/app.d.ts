/// <reference types="@sveltejs/kit" />
// See https://kit.svelte.dev/docs/types#app
declare global {
	namespace App {
		interface Locals {
			user: {
				id: string;
				username: string;
				email: string;
				avatar_url: string;
				role: 'admin' | 'analyst';
			} | null;
		}

		interface PageData {
			user?: App.Locals['user'];
		}
	}
}

export {};
