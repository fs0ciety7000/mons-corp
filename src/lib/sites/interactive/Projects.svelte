<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import SectionHead from '#lib/sites/division/SectionHead.svelte';
	import { projects, type ProjectKind } from './projects.ts';
	import { reveal, scramble } from '#lib/motion/actions.ts';
	import { prefersReducedMotion } from '#lib/motion/tokens.ts';

	let { index }: { index: string } = $props();

	const filters: { id: 'tous' | ProjectKind; label: string }[] = [
		{ id: 'tous', label: 'Tous' },
		{ id: 'jeu', label: 'Jeux' },
		{ id: 'web', label: 'Web & apps' }
	];
	let active = $state<'tous' | ProjectKind>('tous');
	const shown = $derived(projects.filter((p) => active === 'tous' || p.kind === active));
	const count = (id: 'tous' | ProjectKind) =>
		id === 'tous' ? projects.length : projects.filter((p) => p.kind === id).length;
	const ms = (v: number) => (prefersReducedMotion() ? 0 : v);
	const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'];
</script>

<section id="projets" class="relative section-y" aria-labelledby="projets-title">
	<SectionHead
		{index}
		label="Projets"
		title={{ before: 'Les mondes', em: 'que nous avons forgés.' }}
		id="projets-title"
	/>
	<p class="mt-8 max-w-[56ch] gutter-x text-lead text-ash lg:ml-[25%]" use:reveal={{ delay: 0.15 }}>
		Des jeux pour le navigateur, des applications pour le quotidien et des outils métier. Chaque
		projet est conçu, développé et mis en ligne par le studio.
	</p>

	<div class="mt-12 flex flex-wrap gap-2 gutter-x" role="group" aria-label="Filtrer les projets">
		{#each filters as f (f.id)}
			<button
				type="button"
				class={['label filter', active === f.id && 'is-active']}
				aria-pressed={active === f.id}
				onclick={() => (active = f.id)}
			>
				{f.label} <span class="ml-1 opacity-60">{count(f.id)}</span>
			</button>
		{/each}
	</div>

	<ul class="grid-cardor mt-10 gap-y-6">
		{#each shown as p (p.id)}
			<li
				class="col-span-4 md:col-span-4 lg:col-span-6"
				animate:flip={{ duration: ms(500) }}
				in:fade={{ duration: ms(300) }}
			>
				<a href={p.url} target="_blank" rel="noopener" class="project group" data-cursor="Jouer">
					<div class="relative aspect-[16/10] overflow-clip border-b border-smoke bg-graphite">
						<img
							src={p.cover}
							alt=""
							loading="lazy"
							decoding="async"
							width="1200"
							height="750"
							class="size-full object-cover transition-transform duration-[1.2s] ease-(--ease-cardor-out) group-hover:scale-[1.04]"
						/>
						<span class="scan" aria-hidden="true"></span>
						<span
							class="absolute top-4 left-4 rounded-full bg-void/80 px-3 py-1.5 label backdrop-blur"
						>
							<span class={p.status === 'En ligne' ? 'text-signal' : 'text-creative'}>●</span>
							{p.status}
						</span>
						<span class="absolute top-4 right-4 font-mono text-xs text-bone/80"
							>{roman[projects.indexOf(p)]} / VI</span
						>
					</div>
					<div class="flex flex-1 flex-col gap-4 p-6 md:p-8">
						<div class="flex items-baseline justify-between gap-4">
							<h3 class="font-display text-h2">
								<span use:scramble={{ onReveal: false, hoverParent: '.project', duration: 0.6 }}
									>{p.name}</span
								>
							</h3>
							<span class="label text-ash transition-colors group-hover:text-signal">↗</span>
						</div>
						<p class="label text-ash">{p.category}</p>
						<p class="font-display text-lead italic">{p.pitch}</p>
						<p class="text-sm text-ash">{p.text}</p>
						<ul class="space-y-1 text-sm">
							{#each p.features as feat (feat)}
								<li class="flex gap-2"><span class="text-signal">▸</span>{feat}</li>
							{/each}
						</ul>
						<div class="mt-auto flex items-end justify-between gap-6 border-t border-smoke pt-4">
							<p class="font-mono text-xs text-ash">{p.stack}</p>
							{#if p.stat}
								<p class="shrink-0 text-right">
									<span class="block font-display text-h2 leading-none text-signal"
										>{p.stat.value}</span
									>
									<span class="block max-w-[16ch] label text-ash">{p.stat.label}</span>
								</p>
							{/if}
						</div>
					</div>
				</a>
			</li>
		{/each}
	</ul>

	<div class="mt-6 gutter-x">
		<div
			class="next relative overflow-clip border border-dashed border-smoke"
			use:reveal={{ type: 'block' }}
		>
			<img
				src="/sites/interactive/projects/next-world.webp"
				alt=""
				loading="lazy"
				class="absolute inset-0 size-full object-cover opacity-25"
			/>
			<div class="relative p-8 md:p-12">
				<p class="label text-signal">Prochain monde</p>
				<p class="mt-3 font-display text-h1">Déjà <em class="text-signal">en forge</em>.</p>
				<p class="mt-3 max-w-[52ch] text-ash">
					De nouveaux projets rejoindront bientôt cette galerie. Chaque monde publié par le studio
					est présenté ici dès sa mise en ligne.
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	.filter {
		border: 1px solid var(--color-smoke);
		border-radius: 999px;
		padding: 0.6rem 1rem;
		color: var(--color-ash);
		transition:
			color 0.3s,
			background-color 0.3s,
			border-color 0.3s;
	}
	.filter:hover {
		color: var(--color-bone);
		border-color: var(--color-bone);
	}
	.filter.is-active {
		background: var(--color-signal);
		border-color: var(--color-signal);
		color: var(--color-void);
	}
	.project {
		display: flex;
		flex-direction: column;
		height: 100%;
		border: 1px solid var(--color-smoke);
		background: var(--color-ink);
		transition: border-color 0.5s var(--ease-cardor-out);
	}
	.project:hover,
	.project:focus-visible {
		border-color: color-mix(in oklab, var(--color-signal) 50%, var(--color-smoke));
	}
	/* CRT scanline sweep on hover — the Interactive glitch signature */
	.scan {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			transparent 0%,
			color-mix(in oklab, var(--color-signal) 22%, transparent) 50%,
			transparent 100%
		);
		background-size: 100% 30%;
		background-repeat: no-repeat;
		background-position: 0 -40%;
		mix-blend-mode: screen;
		opacity: 0;
	}
	.project:hover .scan {
		opacity: 1;
		animation: scan 0.9s steps(9) 1;
	}
	@keyframes scan {
		to {
			background-position: 0 140%;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.project:hover .scan {
			animation: none;
			opacity: 0;
		}
	}
</style>
