<script lang="ts">
	import { UserCircle, Shield, CheckCircle2, XCircle } from 'lucide-svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	const u = data.user!;
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Page Header -->
	<div class="mb-8 flex items-center gap-3">
		<UserCircle class="w-8 h-8 text-indigo-400" />
		<h1 class="text-4xl font-bold text-white">My Account</h1>
	</div>

	<!-- Profile Card -->
	<div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 shadow-xl">
		<div class="flex flex-col md:flex-row gap-8 items-start md:items-center mb-8 pb-8 border-b border-white/10">
			<img src={u.avatar_url} alt={u.username} class="w-24 h-24 rounded-2xl object-cover shadow-lg border border-white/20" />
			<div>
				<h2 class="text-2xl font-bold text-white mb-2">@{u.username}</h2>
				<span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider {u.role === 'admin' ? 'bg-orange-500/20 text-orange-400 border border-orange-400/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-400/30'}">
					<Shield class="w-3.5 h-3.5" />
					{u.role}
				</span>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<div class="flex flex-col gap-2">
				<div class="text-xs font-semibold text-indigo-300 uppercase tracking-wider">User ID</div>
				<span class="text-indigo-200/70 font-mono text-sm bg-black/20 p-2 rounded-lg break-all">{u.id}</span>
			</div>
			<div class="flex flex-col gap-2">
				<div class="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Email</div>
				<span class="text-white font-medium">{u.email || '—'}</span>
			</div>
			<div class="flex flex-col gap-2">
				<div class="text-xs font-semibold text-indigo-300 uppercase tracking-wider">System Role</div>
				<span class="text-white font-medium capitalize">{u.role}</span>
			</div>
		</div>
	</div>

	<!-- Permissions Card -->
	<div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
		<h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
			<Shield class="w-5 h-5 text-indigo-400" />
			Role Permissions
		</h3>
		
		<ul class="space-y-4">
			<li class="flex items-center gap-3 text-indigo-200">
				<CheckCircle2 class="w-5 h-5 text-green-400" />
				<span>View and search all profiles</span>
			</li>
			<li class="flex items-center gap-3 text-indigo-200">
				<CheckCircle2 class="w-5 h-5 text-green-400" />
				<span>Export profiles as CSV</span>
			</li>
			{#if u.role === 'admin'}
				<li class="flex items-center gap-3 text-indigo-200">
					<CheckCircle2 class="w-5 h-5 text-green-400" />
					<span>Create new profiles</span>
				</li>
				<li class="flex items-center gap-3 text-indigo-200">
					<CheckCircle2 class="w-5 h-5 text-green-400" />
					<span>Delete profiles</span>
				</li>
			{:else}
				<li class="flex items-center gap-3 text-indigo-200/50">
					<XCircle class="w-5 h-5 text-red-400/50" />
					<span>Create new profiles (Admin only)</span>
				</li>
				<li class="flex items-center gap-3 text-indigo-200/50">
					<XCircle class="w-5 h-5 text-red-400/50" />
					<span>Delete profiles (Admin only)</span>
				</li>
			{/if}
		</ul>
	</div>
</div>
