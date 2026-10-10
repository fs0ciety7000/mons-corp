<script lang="ts">
	import { divisions } from '#lib/data/divisions.ts';
	import { site, socials } from '#lib/data/site.ts';
	import { magnetic, reveal } from '#lib/motion/actions.ts';
	import ParisClock from './ParisClock.svelte';
</script>

<footer class="relative overflow-clip border-t border-smoke pt-24 md:pt-40">
	<div class="grid-cardor gap-y-12">
		<p class="col-span-4 label text-ash md:col-span-8 lg:col-span-12" use:reveal>[03] — Contact</p>
		<h2
			class="col-span-4 font-display text-display md:col-span-8 lg:col-span-9"
			use:reveal={{ type: 'chars' }}
		>
			Fabriquons <em class="text-ember">votre</em> monde.
		</h2>
		<div class="col-span-4 flex items-end md:col-span-8 lg:col-span-3 lg:justify-end">
			<a
				href="mailto:{site.email}"
				use:magnetic={0.35}
				data-cursor="Écrire"
				class="cta group relative inline-flex items-center gap-3 overflow-clip rounded-full bg-bone px-7 py-4 text-void"
			>
				<span class="relative z-10 font-medium">{site.email}</span>
				<span class="relative z-10" aria-hidden="true">→</span>
			</a>
		</div>
	</div>

	<div class="grid-cardor mt-24 gap-y-10 border-t border-smoke pt-10 md:mt-32">
		<div class="col-span-4 lg:col-span-4">
			<p class="mb-4 label text-ash">Divisions</p>
			<ul class="space-y-2">
				{#each divisions as d (d.id)}
					<li>
						<a href={d.url} class="foot-link" style:--division={d.color}>{d.name}</a>
					</li>
				{/each}
			</ul>
		</div>
		<div class="col-span-2 lg:col-span-3">
			<p class="mb-4 label text-ash">Maison</p>
			<ul class="space-y-2">
				<li><a href="/#manifeste" class="foot-link">Manifeste</a></li>
				<li><a href="/contact" class="foot-link">Contact</a></li>
			</ul>
		</div>
		<div class="col-span-2 lg:col-span-3">
			<p class="mb-4 label text-ash">Réseaux</p>
			<ul class="space-y-2">
				{#each socials as s (s.label)}
					<li><a href={s.href} class="foot-link" rel="noopener" target="_blank">{s.label}</a></li>
				{/each}
			</ul>
		</div>
		<div class="col-span-4 md:col-span-8 lg:col-span-2 lg:text-right">
			<p class="mb-4 label text-ash">{site.city}</p>
			<ParisClock />
		</div>
	</div>

	<div class="mt-20 flex flex-col justify-between gap-4 gutter-x pb-8 text-ash md:flex-row">
		<span class="label">© {new Date().getFullYear()} CARDOR Media — Tous droits réservés</span>
		<span class="label">Opéré depuis la salle des machines</span>
	</div>

	<p
		class="pointer-events-none mt-4 -mb-[0.18em] text-center font-display text-[33vw] leading-[0.8] tracking-[-0.04em] whitespace-nowrap text-graphite select-none"
		aria-hidden="true"
	>
		CARDOR
	</p>
</footer>

<style>
	.cta::before {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--color-ember);
		transform: translateY(101%);
		border-radius: inherit;
		transition: transform 0.6s var(--ease-cardor-out);
	}
	.cta:hover::before,
	.cta:focus-visible::before {
		transform: translateY(0);
	}
	.cta:active {
		scale: 0.97;
	}
	.foot-link {
		background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat;
		transition:
			background-size 0.6s var(--ease-cardor-out),
			color 0.3s;
	}
	.foot-link:hover,
	.foot-link:focus-visible {
		background-size: 100% 1px;
		color: var(--division, var(--color-bone));
	}
</style>
