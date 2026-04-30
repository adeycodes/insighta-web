<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	const p = data.profile;
	const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
</script>

<a href="/profiles" class="back-link">← Back to Profiles</a>

<div class="card">
	<div class="profile-header">
		<div class="avatar">{p.name.charAt(0).toUpperCase()}</div>
		<div>
			<h1>{p.name}</h1>
			<span class="id">ID: {p.id}</span>
		</div>
	</div>

	<div class="grid">
		<div class="field">
			<label>Gender</label>
			<value>
				<span class="badge gender-{p.gender}">{p.gender}</span>
				<span class="muted">{pct(p.gender_probability)} confidence · {p.sample_size.toLocaleString()} samples</span>
			</value>
		</div>

		<div class="field">
			<label>Age</label>
			<value>{p.age} years <span class="muted">({p.age_group})</span></value>
		</div>

		<div class="field">
			<label>Country</label>
			<value>
				{p.country_name}
				<span class="muted">({p.country_id} · {pct(p.country_probability)} confidence)</span>
			</value>
		</div>

		<div class="field">
			<label>Created</label>
			<value>{new Date(p.created_at).toLocaleString()}</value>
		</div>
	</div>
</div>

<style>
	.back-link {
		display: inline-block;
		margin-bottom: 1.25rem;
		color: #666;
		font-size: 0.875rem;
	}

	.card {
		background: #fff;
		border-radius: 14px;
		padding: 2rem;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
	}

	.profile-header {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid #f0f0f0;
	}

	.avatar {
		width: 60px;
		height: 60px;
		background: #4361ee;
		color: #fff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.75rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1a1a2e;
	}

	.id {
		font-size: 0.78rem;
		color: #bbb;
		font-family: monospace;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1.5rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	label {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: #999;
	}

	value {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.95rem;
		color: #1a1a2e;
		flex-wrap: wrap;
	}

	.muted {
		color: #aaa;
		font-size: 0.85em;
	}

	.badge {
		display: inline-block;
		padding: 3px 10px;
		border-radius: 12px;
		font-size: 0.8rem;
		font-weight: 500;
	}

	.badge.gender-male {
		background: #e8f4fd;
		color: #2779bd;
	}

	.badge.gender-female {
		background: #fde8f4;
		color: #bd2779;
	}
</style>
