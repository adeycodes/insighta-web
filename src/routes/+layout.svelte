<script lang="ts">
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import {
		LogOut,
		LayoutDashboard,
		Users,
		Search,
		UserCircle,
		Sparkles,
	} from "lucide-svelte";
	import "../app.css";
	import type { LayoutData } from "./$types";

	export let data: LayoutData;

	onMount(() => {
		function getCookie(name: string): string {
			return (
				document.cookie
					.split("; ")
					.find((c) => c.startsWith(name + "="))
					?.split("=")[1] ?? ""
			);
		}

		const field = document.getElementById(
			"csrf-field",
		) as HTMLInputElement | null;
		if (field) field.value = getCookie("csrf_token");

		// 🔍 Auth Debug
		console.group("🔍 Auth Debug — Layout");
		console.log("Current URL:", window.location.href);
		console.log("User:", data.user ?? "❌ null — not logged in");
		console.log("Session cookie:", getCookie("session") || "not found");
		console.log("CSRF cookie:", getCookie("csrf_token") || "not found");
		console.log("All cookies raw:", document.cookie || "none visible");
		console.log("Full page data:", data);
		console.groupEnd();
	});

	// Log every page navigation
	$: {
		console.log("📍 Route:", $page.url.pathname);
		console.log("👤 User on route change:", data.user ?? "null");
	}

	const navItems = [
		{ name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
		{ name: "Profiles", path: "/profiles", icon: Users },
		{ name: "Search", path: "/search", icon: Search },
		{ name: "Account", path: "/account", icon: UserCircle },
	];

	$: isActive = (path: string) => $page.url.pathname.startsWith(path);
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Insighta Labs+</title>
</svelte:head>

<div
	class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex"
>
	{#if data.user}
		<!-- Sidebar -->
		<aside
			class="w-72 min-h-screen backdrop-blur-xl bg-slate-900/50 border-r border-white/10 flex flex-col hidden md:flex"
		>
			<!-- Logo Section -->
			<div class="p-6 border-b border-white/10">
				<a href="/dashboard" class="flex items-center gap-3 group">
					<div
						class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all group-hover:scale-105"
					>
						<span class="text-2xl font-bold text-white">I+</span>
					</div>
					<div>
						<h1 class="text-lg font-bold text-white tracking-tight">
							Insighta Labs+
						</h1>
						<p class="text-xs text-indigo-300/70">
							Profile Intelligence
						</p>
					</div>
				</a>
			</div>

			<!-- User Info -->
			<div class="p-6 border-b border-white/10">
				<div class="flex items-center gap-3 mb-3">
					<div
						class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
					>
						<span class="text-lg font-bold text-white"
							>{data.user.username.charAt(0).toUpperCase()}</span
						>
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-semibold text-white truncate">
							@{data.user.username}
						</p>
					</div>
				</div>
				<div
					class="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full"
				>
					<Sparkles class="w-3.5 h-3.5 text-purple-300" />
					<span
						class="text-xs font-semibold text-purple-200 capitalize"
						>{data.user.role}</span
					>
				</div>
			</div>

			<!-- Navigation Links -->
			<nav class="flex-1 p-4">
				<div class="space-y-2">
					{#each navItems as item}
						<a href={item.path} class="relative block group">
							<div
								class={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
									isActive(item.path)
										? "text-white"
										: "text-indigo-200/70 hover:text-white"
								}`}
							>
								<svelte:component
									this={item.icon}
									class="w-5 h-5"
								/>
								<span class="font-semibold">{item.name}</span>
							</div>

							{#if isActive(item.path)}
								<div
									class="absolute inset-0 bg-gradient-to-r from-indigo-600/50 to-cyan-600/50 rounded-xl"
								></div>
							{:else}
								<div
									class="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
								></div>
							{/if}
						</a>
					{/each}
				</div>
			</nav>

			<!-- Sign Out Section -->
			<div class="p-4 border-t border-white/10">
				<form method="POST" action="/auth/logout">
					<input
						type="hidden"
						name="csrf_token"
						id="csrf-field"
						value=""
					/>
					<button
						type="submit"
						class="w-full flex items-center gap-3 px-4 py-3 text-red-200 hover:text-white bg-red-500/10 hover:bg-red-500/20 border border-red-400/20 hover:border-red-400/40 rounded-xl transition-all font-semibold"
					>
						<LogOut class="w-5 h-5" />
						<span>Sign Out</span>
					</button>
				</form>
			</div>
		</aside>
	{/if}

	<!-- Main Content Area -->
	<main class="flex-1 min-h-screen overflow-auto">
		<slot />
	</main>
</div>
