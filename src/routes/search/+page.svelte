<script lang="ts">
	import { goto } from "$app/navigation";
	import { Search, Sparkles } from "lucide-svelte";
	import type { PageData } from "./$types";

	export let data: PageData;

	if (!data.user) {
		goto("/");
	}

	let query = data.q;
	const examples = [
		"young males from Nigeria",
		"adult women in Kenya",
		"teenagers above 15",
		"senior men in South Africa",
		"females between 25 and 35",
	];

	function search() {
		if (!query.trim()) return;
		goto("/search?q=" + encodeURIComponent(query));
	}

	function genderClass(gender: string) {
		return gender === "female"
			? "bg-pink-500/20 text-pink-300 border border-pink-400/40"
			: "bg-blue-500/20 text-blue-300 border border-blue-400/40";
	}
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Page Header -->
	<div class="mb-8">
		<h1 class="text-4xl font-bold text-white mb-2">
			Natural Language Search
		</h1>
		<p class="text-indigo-300/70">
			Describe the profiles you're looking for in plain English.
		</p>
	</div>

	<!-- Search Box -->
	<div
		class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl mb-8"
	>
		<div class="flex flex-col sm:flex-row gap-4 mb-4">
			<div class="flex-1 relative">
				<div
					class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
				>
					<Search class="h-5 w-5 text-indigo-400" />
				</div>
				<input
					type="text"
					bind:value={query}
					on:keydown={(e) => e.key === "Enter" && search()}
					placeholder="Try 'young males from Nigeria'"
					class="w-full pl-11 pr-4 py-4 bg-slate-800/80 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner text-lg"
				/>
			</div>
			<button
				on:click={search}
				disabled={!query.trim()}
				class="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 hover:scale-105 disabled:hover:scale-100 disabled:hover:translate-y-0 whitespace-nowrap"
			>
				Search
			</button>
		</div>

		<!-- Examples -->
		<div class="flex flex-wrap items-center gap-2">
			<span class="text-sm text-indigo-300/60 font-medium mr-2">Try:</span
			>
			{#each examples as ex}
				<button
					class="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/50 text-indigo-200 text-sm rounded-full transition-colors"
					on:click={() => {
						query = ex;
						search();
					}}
				>
					{ex}
				</button>
			{/each}
		</div>
	</div>

	{#if data.profiles === null && data.q}
		<div
			class="bg-amber-500/10 border border-amber-400/50 text-amber-200 px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3"
		>
			<Sparkles class="w-5 h-5 text-amber-400" />
			<span
				>Could not interpret your query. Try rephrasing — e.g. "adult
				females from Ghana".</span
			>
		</div>
	{:else if data.profiles}
		<div class="mb-4 text-indigo-200">
			<strong class="text-white text-lg"
				>{data.profiles.total.toLocaleString()}</strong
			>
			result{data.profiles.total !== 1 ? "s" : ""}
			for "<em class="text-indigo-400">{data.q}</em>"
		</div>

		<div
			class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl"
		>
			{#if data.profiles.data.length === 0}
				<div class="p-12 text-center text-indigo-300/70 text-lg">
					No profiles matched your search.
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-white/10 bg-white/5">
								<th
									class="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider"
									>Name</th
								>
								<th
									class="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider"
									>Gender</th
								>
								<th
									class="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider"
									>Age</th
								>
								<th
									class="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider"
									>Country</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-white/5">
							{#each data.profiles.data as profile}
								<tr
									class="hover:bg-white/5 transition-colors group"
								>
									<td class="px-6 py-4 whitespace-nowrap">
										<a
											href="/profiles/{profile.id}"
											class="text-sm font-semibold text-white hover:text-indigo-300 transition-colors"
											>{profile.name}</a
										>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span
											class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold {genderClass(
												profile.gender,
											)}"
										>
											{profile.gender}
										</span>
									</td>
									<td
										class="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-200"
									>
										{profile.age}
										<span
											class="text-indigo-400/50 text-xs font-normal"
											>({profile.age_group})</span
										>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span
											class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30"
										>
											{profile.country_name}
										</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	{/if}
</div>
