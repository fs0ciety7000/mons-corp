<script lang="ts">
	import { divisions } from '#lib/data/divisions.ts';
	import { reveal } from '#lib/motion/actions.ts';
</script>

<section id="divisions" class="relative section-y" aria-labelledby="divisions-title">
	<div class="grid-cardor gap-y-8">
		<p class="col-span-4 label text-ash md:col-span-2 lg:col-span-3" use:reveal>[02] — Divisions</p>
		<h2
			id="divisions-title"
			class="col-span-4 font-display text-display md:col-span-8 lg:col-span-9"
			use:reveal={{ type: 'chars' }}
		>
			Trois studios, <em class="text-ember">un seul</em> noyau.
		</h2>
	</div>

	<ul class="grid-cardor mt-16 gap-y-6 md:mt-24">
		{#each divisions as d, i (d.id)}
			<li
				class="col-span-4 md:col-span-8 lg:col-span-4"
				use:reveal={{ type: 'block', delay: i * 0.12 }}
			>
				<a
					href={d.url}
					class="card group relative flex h-full min-h-[520px] flex-col overflow-clip border border-smoke bg-ink p-6 md:p-8"
					style:--division={d.color}
					data-cursor={d.cursorLabel}
				>
					<div class="orb" aria-hidden="true"></div>

					<div class="relative flex items-start justify-between">
						<span class="label text-ash">{d.index} / {d.host}</span>
						<span
							class="text-xl text-ash transition-[color,translate] duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-(--division)"
							aria-hidden="true">↗</span
						>
					</div>

					<div class="relative mt-auto">
						<h3 class="font-display text-h1">
							<span class="block text-ash">OCC</span>
							<span
								class="block transition-colors duration-500 group-hover:text-(--division) group-hover:italic"
								>{d.short}</span
							>
						</h3>
						<p class="mt-4 font-display text-lead italic">{d.tagline}</p>
						<p class="mt-4 max-w-[40ch] text-sm text-ash">{d.description}</p>
						<ul class="mt-6 flex flex-wrap gap-2">
							{#each d.disciplines as disc (disc)}
								<li class="rounded-full border border-smoke px-3 py-1.5 label text-ash">{disc}</li>
							{/each}
						</ul>
					</div>

					<span
						class="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-(--division) transition-transform duration-700 ease-(--ease-cardor-out) group-hover:scale-x-100"
						aria-hidden="true"
					></span>
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	.card {
		transition: border-color 0.5s var(--ease-cardor-out);
	}
	.card:hover,
	.card:focus-visible {
		border-color: color-mix(in oklab, var(--division) 45%, var(--color-smoke));
	}
	.orb {
		position: absolute;
		width: 70%;
		aspect-ratio: 1;
		top: -10%;
		right: -20%;
		border-radius: 50%;
		background: conic-gradient(
			from 0deg,
			var(--division),
			transparent 30%,
			color-mix(in oklab, var(--division) 60%, black) 55%,
			transparent 80%,
			var(--division)
		);
		filter: blur(60px);
		opacity: 0.12;
		transform: scale(0.85);
		animation: spin 18s linear infinite;
		transition:
			opacity 0.8s var(--ease-cardor-out),
			transform 1.2s var(--ease-cardor-out);
	}
	.card:hover .orb,
	.card:focus-visible .orb {
		opacity: 0.45;
		transform: scale(1.15);
	}
	@keyframes spin {
		to {
			rotate: 360deg;
		}
	}
</style>
