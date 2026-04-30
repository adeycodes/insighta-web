<script lang="ts">
	import { Users, Search, UserCircle, TrendingUp, Eye } from 'lucide-svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	const pct = (v: number) => `${(v * 100).toFixed(0)}%`;

	const quickActions = [
		{
			title: 'Browse Profiles',
			description: 'Explore all enriched user profiles',
			icon: Users,
			color: 'from-indigo-500 to-cyan-500',
			link: '/profiles'
		},
		{
			title: 'Natural Language Search',
			description: 'Search profiles using AI',
			icon: Search,
			color: 'from-purple-500 to-pink-500',
			link: '/search'
		},
		{
			title: 'My Account',
			description: 'Manage your settings',
			icon: UserCircle,
			color: 'from-orange-500 to-amber-500',
			link: '/account'
		}
	];
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Welcome Header -->
	<div class="mb-8">
		<h1 class="text-4xl font-bold text-white mb-2">
			Welcome back, <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">@{data.user?.username}</span>
		</h1>
		<p class="text-indigo-300/70">Here's what's happening with your profiles today</p>
	</div>

	<!-- Stats Card -->
	<div class="mb-8">
		<div class="relative group overflow-hidden backdrop-blur-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-cyan-500/20 border border-white/20 rounded-2xl p-6 shadow-2xl">
			<div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

			<div class="relative flex items-center justify-between">
				<div>
					<p class="text-indigo-300/80 text-sm font-semibold uppercase tracking-wider mb-2">
						Total Profiles
					</p>
					<p class="text-5xl font-bold text-white mb-1">{data.totalProfiles.toLocaleString()}</p>
					<!-- Static text for now, could be dynamic later -->
					<div class="flex items-center gap-2 text-green-400 text-sm font-medium">
						<TrendingUp class="w-4 h-4" />
						<span>Growing steadily</span>
					</div>
				</div>
				<div class="w-20 h-20 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
					<Users class="w-10 h-10 text-white" />
				</div>
			</div>
		</div>
	</div>

	<!-- Recently Added Section -->
	<div class="mb-8">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-2xl font-bold text-white">Recently Added</h2>
			<a href="/profiles" class="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">View all →</a>
		</div>

		<div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
			{#if data.recentProfiles.length === 0}
				<div class="p-8 text-center text-indigo-300/70">
					<p>No profiles yet. Create one to get started.</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-white/10 bg-white/5">
								<th class="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">Name</th>
								<th class="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">Gender</th>
								<th class="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">Age</th>
								<th class="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">Country</th>
								<th class="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">Confidence</th>
								<th class="px-6 py-4 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider">Action</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-white/5">
							{#each data.recentProfiles as profile}
								<tr class="hover:bg-white/5 transition-colors">
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="text-sm font-medium text-white">{profile.name}</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold {profile.gender === 'female' ? 'bg-pink-500/20 text-pink-300 border border-pink-400/30' : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'}">
											{profile.gender}
										</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-indigo-200">
										{profile.age} <span class="text-indigo-400/50 text-xs">({profile.age_group})</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-indigo-200">
										{profile.country_name}
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="flex items-center gap-2">
											<div class="w-16 bg-white/10 rounded-full h-2">
												<div class="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style="width: {pct(profile.gender_probability)}"></div>
											</div>
											<span class="text-xs font-semibold text-green-400">{pct(profile.gender_probability)}</span>
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<a href="/profiles/{profile.id}" class="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
											<Eye class="w-3.5 h-3.5" />
											View
										</a>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</div>

	<!-- Quick Actions -->
	<div>
		<h2 class="text-2xl font-bold text-white mb-4">Quick Actions</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			{#each quickActions as action}
				<a href={action.link} class="block group relative overflow-hidden backdrop-blur-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-6 shadow-xl transition-all transform hover:-translate-y-1 hover:scale-[1.02]">
					<div class="absolute inset-0 bg-gradient-to-br {action.color} opacity-0 group-hover:opacity-10 transition-opacity"></div>

					<div class="relative">
						<div class="w-12 h-12 bg-gradient-to-br {action.color} rounded-xl flex items-center justify-center mb-4 shadow-lg">
							<svelte:component this={action.icon} class="w-6 h-6 text-white" />
						</div>
						<h3 class="text-lg font-bold text-white mb-2">{action.title}</h3>
						<p class="text-sm text-indigo-300/70">{action.description}</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>
