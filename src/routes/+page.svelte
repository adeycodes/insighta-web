<script lang="ts">
	import { fade } from "svelte/transition";
	import type { PageData } from "./$types";

	export let data: PageData;

	const loginURL = `${import.meta.env.VITE_BACKEND_URL}/auth/github?source=web`;
</script>

<div
	class="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"
>
	<!-- Animated background orbs -->
	<div class="absolute inset-0 overflow-hidden">
		<div
			class="absolute w-96 h-96 rounded-full bg-gradient-to-r from-indigo-500/30 to-cyan-500/30 blur-3xl"
			style="top: 10%; left: 10%; animation: float 20s infinite ease-in-out;"
		></div>
		<div
			class="absolute w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"
			style="bottom: 10%; right: 10%; animation: float-reverse 25s infinite ease-in-out;"
		></div>
	</div>

	<!-- Grid pattern overlay -->
	<div
		class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]"
	></div>

	<!-- Login card -->
	<div
		class="relative z-10 flex items-center justify-center min-h-screen p-4"
	>
		<div class="w-full max-w-md" in:fade={{ duration: 600 }}>
			<!-- Glassmorphic card -->
			<div
				class="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
			>
				<!-- Gradient border effect -->
				<div
					class="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-cyan-500/20 rounded-3xl"
				></div>

				<div class="relative p-8 sm:p-12">
					<!-- Logo and branding -->
					<div class="text-center mb-10">
						<div class="inline-block mb-4">
							<div
								class="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/50"
							>
								<span class="text-3xl font-bold text-white"
									>I+</span
								>
							</div>
						</div>

						<h1
							class="text-3xl font-bold text-white mb-2 tracking-tight"
						>
							Insighta Labs+
						</h1>

						<p class="text-indigo-200/80 text-sm font-medium">
							Profile Intelligence System
						</p>
					</div>

					<!-- Divider -->
					<div class="relative mb-8">
						<div class="absolute inset-0 flex items-center">
							<div class="w-full border-t border-white/10"></div>
						</div>
						<div
							class="relative flex justify-center text-xs uppercase"
						>
							<span
								class="bg-slate-900/50 px-4 py-1 rounded-full text-indigo-300/70 font-semibold tracking-wider"
							>
								Welcome Back
							</span>
						</div>
					</div>

					<!-- GitHub login button -->
					<a
						href={loginURL}
						class="w-full group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/50 inline-block text-center flex items-center justify-center gap-3"
					>
						<svg
							class="w-5 h-5"
							viewBox="0 0 24 24"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
							/>
						</svg>
						<span class="text-base">Continue with GitHub</span>
						<div
							class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
						></div>
					</a>

					<p class="text-center text-xs text-indigo-300/60 mt-6">
						Secure authentication powered by GitHub OAuth
					</p>
				</div>
			</div>

			<p
				class="text-center text-sm text-indigo-300/50 mt-6"
				in:fade={{ delay: 800, duration: 400 }}
			>
				Advanced AI-powered profile enrichment and analytics
			</p>
		</div>
	</div>
</div>

<style>
	@keyframes float {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		50% {
			transform: translate(100px, -100px) scale(1.2);
		}
	}
	@keyframes float-reverse {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		50% {
			transform: translate(-100px, 100px) scale(1.3);
		}
	}
</style>
