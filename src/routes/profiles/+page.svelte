<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Plus, Filter, Download, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let showCreateForm = false;
	let newName = '';
	let csrfToken = '';

	// Read CSRF token from cookie (readable by JS — intentional).
	if (typeof document !== 'undefined') {
		csrfToken = document.cookie
			.split('; ')
			.find((c) => c.startsWith('csrf_token='))
			?.split('=')[1] ?? '';
	}

	const pct = (v: number) => `${(v * 100).toFixed(0)}%`;
	const isAdmin = data.user?.role === 'admin';

	function applyFilter(event: Event) {
		const form = event.currentTarget as HTMLFormElement;
		const params = new URLSearchParams(new FormData(form) as any);
		// Remove empty params.
		for (const [k, v] of [...params.entries()]) {
			if (!v) params.delete(k);
		}
		goto('/profiles?' + params.toString());
	}

	function goTo(p: number) {
		const q = new URLSearchParams($page.url.searchParams);
		q.set('page', String(p));
		goto('/profiles?' + q.toString());
	}

	const { profiles, query } = data;
	$: exportUrl = `${import.meta.env.VITE_BACKEND_URL}/api/profiles/export?format=csv&${new URLSearchParams(query as any).toString()}`;
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
		<div>
			<h1 class="text-4xl font-bold text-white mb-2">Profiles Data Grid <span class="text-indigo-400 text-2xl font-normal">({profiles.total.toLocaleString()})</span></h1>
			<p class="text-indigo-300/70">Manage and explore enriched user profiles</p>
		</div>

		{#if isAdmin}
			<button
				on:click={() => (showCreateForm = !showCreateForm)}
				class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/50 transition-all transform hover:-translate-y-0.5 hover:scale-105"
			>
				{#if showCreateForm}
					<span>Cancel</span>
				{:else}
					<Plus class="w-5 h-5" />
					<span>New Profile</span>
				{/if}
			</button>
		{/if}
	</div>

	{#if form?.error}
		<div class="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-xl mb-6 shadow-lg">
			{form.error}
		</div>
	{/if}

	{#if showCreateForm && isAdmin}
		<div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 shadow-xl transform transition-all duration-300">
			<h2 class="text-lg font-bold text-white mb-4">Create Profile</h2>
			<form method="POST" action="?/create" use:enhance class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
				<input type="hidden" name="csrf_token" value={csrfToken} />
				<div class="flex-1 w-full relative">
					<input
						type="text"
						name="name"
						placeholder="Enter a name (e.g. Amara Okonkwo)"
						bind:value={newName}
						required
						class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
					/>
				</div>
				<button class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105" type="submit" disabled={!newName.trim()}>
					Create
				</button>
			</form>
			<p class="text-indigo-300/60 text-sm mt-3">We'll enrich this with gender, age, and country data automatically.</p>
		</div>
	{/if}

	<!-- Filters Section -->
	<div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 shadow-xl">
		<div class="flex items-center gap-2 mb-4">
			<Filter class="w-5 h-5 text-indigo-400" />
			<h2 class="text-lg font-bold text-white">Filters</h2>
		</div>

		<form on:submit|preventDefault={applyFilter}>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
				<!-- Gender Filter -->
				<div>
					<label for="filter-gender" class="block text-xs font-semibold text-indigo-300 mb-2 uppercase tracking-wider">Gender</label>
					<select id="filter-gender" name="gender" value={query.gender ?? ''} class="w-full px-3 py-2 bg-slate-800/80 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
						<option value="">All</option>
						<option value="male">Male</option>
						<option value="female">Female</option>
					</select>
				</div>

				<!-- Age Group Filter -->
				<div>
					<label for="filter-age-group" class="block text-xs font-semibold text-indigo-300 mb-2 uppercase tracking-wider">Age Group</label>
					<select id="filter-age-group" name="age_group" value={query.age_group ?? ''} class="w-full px-3 py-2 bg-slate-800/80 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
						<option value="">All</option>
						<option value="child">Child</option>
						<option value="teenager">Teenager</option>
						<option value="adult">Adult</option>
						<option value="senior">Senior</option>
					</select>
				</div>

				<!-- Country Filter -->
				<div>
					<label for="filter-country" class="block text-xs font-semibold text-indigo-300 mb-2 uppercase tracking-wider">Country Code</label>
					<input id="filter-country" type="text" name="country_id" placeholder="e.g. NG" value={query.country_id ?? ''} maxlength="2" class="w-full px-3 py-2 bg-slate-800/80 border border-white/20 rounded-lg text-white placeholder-indigo-400/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
				</div>

				<!-- Sort By -->
				<div>
					<label for="filter-sort" class="block text-xs font-semibold text-indigo-300 mb-2 uppercase tracking-wider">Sort By</label>
					<select id="filter-sort" name="sort_by" value={query.sort_by ?? 'created_at'} class="w-full px-3 py-2 bg-slate-800/80 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
						<option value="created_at">Date Added</option>
						<option value="age">Age</option>
						<option value="gender_probability">Confidence</option>
					</select>
				</div>

				<!-- Order -->
				<div>
					<label for="filter-order" class="block text-xs font-semibold text-indigo-300 mb-2 uppercase tracking-wider">Order</label>
					<select id="filter-order" name="order" value={query.order ?? 'desc'} class="w-full px-3 py-2 bg-slate-800/80 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
						<option value="desc">Descending</option>
						<option value="asc">Ascending</option>
					</select>
				</div>

				<!-- Per Page -->
				<div>
					<label for="filter-limit" class="block text-xs font-semibold text-indigo-300 mb-2 uppercase tracking-wider">Per Page</label>
					<select id="filter-limit" name="limit" value={query.limit ?? '10'} class="w-full px-3 py-2 bg-slate-800/80 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
						<option value="10">10</option>
						<option value="25">25</option>
						<option value="50">50</option>
					</select>
				</div>
			</div>

			<!-- Filter Actions -->
			<div class="flex flex-wrap gap-3">
				<button type="submit" class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-sm font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105">
					Apply Filters
				</button>
				<a href="/profiles" class="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-indigo-200 hover:text-white text-sm font-semibold rounded-lg transition-all text-center inline-block">
					Reset
				</a>
				<a href={exportUrl} download class="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-green-300 hover:text-green-200 text-sm font-semibold rounded-lg transition-all ml-auto">
					<Download class="w-4 h-4" />
					Export CSV
				</a>
			</div>
		</form>
	</div>

	<!-- Data Table -->
	<div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl mb-6">
		{#if profiles.data.length === 0}
			<div class="p-12 text-center text-indigo-300/70 text-lg">No profiles match your filters.</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-white/10 bg-white/5">
							<th class="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">ID</th>
							<th class="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">Name</th>
							<th class="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">Gender</th>
							<th class="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">Age</th>
							<th class="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">Country</th>
							<th class="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">Confidence</th>
							<th class="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-white/5">
						{#each profiles.data as profile}
							<tr class="hover:bg-white/5 transition-colors group">
								<td class="px-6 py-4 whitespace-nowrap text-xs text-indigo-300/50 font-mono">
									{profile.id.substring(0, 8)}...
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<a href="/profiles/{profile.id}" class="text-sm font-semibold text-white hover:text-indigo-300 transition-colors">{profile.name}</a>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold {profile.gender === 'female' ? 'bg-pink-500/20 text-pink-300 border border-pink-400/40' : 'bg-blue-500/20 text-blue-300 border border-blue-400/40'}">
										{profile.gender}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-200">
									{profile.age} <span class="text-indigo-400/50 text-xs font-normal">({profile.age_group})</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
										{profile.country_name} ({profile.country_id})
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center gap-3">
										<div class="w-20 bg-white/10 rounded-full h-2">
											<div class="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all" style="width: {pct(profile.gender_probability)}"></div>
										</div>
										<span class="text-xs font-bold text-green-400 min-w-[3rem]">{pct(profile.gender_probability)}</span>
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center gap-2">
										<a href="/profiles/{profile.id}" class="p-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-300 hover:text-indigo-200 rounded-lg transition-all transform hover:scale-110">
											<Eye class="w-4 h-4" />
										</a>
										{#if isAdmin}
											<form method="POST" action="?/delete" use:enhance class="inline-block">
												<input type="hidden" name="id" value={profile.id} />
												<input type="hidden" name="csrf_token" value={csrfToken} />
												<button
													type="submit"
													class="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 hover:text-red-200 rounded-lg transition-all transform hover:scale-110"
													on:click|preventDefault={(e) => {
														if (confirm(`Delete "${profile.name}"?`)) {
															(e.currentTarget).form?.submit();
														}
													}}
												>
													<Trash2 class="w-4 h-4" />
												</button>
											</form>
										{/if}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>

	<!-- Pagination -->
	{#if profiles.data.length > 0}
		<div class="flex items-center justify-between backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-6 py-4 shadow-xl">
			<div class="text-sm text-indigo-300/70 hidden sm:block">
				Showing page <span class="font-semibold text-white">{profiles.page}</span> of <span class="font-semibold text-white">{profiles.total_pages}</span>
			</div>

			<div class="flex items-center gap-2 mx-auto sm:mx-0">
				<button
					on:click={() => goTo(profiles.page - 1)}
					disabled={profiles.page <= 1}
					class="p-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 border border-white/20 disabled:border-white/10 text-indigo-200 disabled:text-indigo-400/50 rounded-lg transition-all disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
				>
					<ChevronLeft class="w-5 h-5" />
				</button>

				<div class="px-4 py-2 bg-gradient-to-r from-indigo-600/50 to-cyan-600/50 border border-indigo-400/30 rounded-lg">
					<span class="text-sm font-semibold text-white">
						Page {profiles.page}
					</span>
				</div>

				<button
					on:click={() => goTo(profiles.page + 1)}
					disabled={profiles.page >= profiles.total_pages}
					class="p-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 border border-white/20 disabled:border-white/10 text-indigo-200 disabled:text-indigo-400/50 rounded-lg transition-all disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
				>
					<ChevronRight class="w-5 h-5" />
				</button>
			</div>
		</div>
	{/if}
</div>
