<script lang="ts">
	import SectionHead from '#lib/sites/division/SectionHead.svelte';
	import { reveal } from '#lib/motion/actions.ts';
	import { hubShots, platform, worlds } from './content.ts';

	let { index }: { index: string } = $props();

	// The chameleon reader: the same Sanctuaire wears each book's world (cardor-publishing's
	// promise), shown as screenshots of the platform in production.
	let current = $state(0);
	const w = $derived(worlds[current]);

	function onKey(e: KeyboardEvent) {
		// Tabs pattern: arrows move between worlds, focus follows the selection.
		const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
		if (!d) return;
		e.preventDefault();
		current = (current + d + worlds.length) % worlds.length;
		document.getElementById(`world-${worlds[current].id}`)?.focus();
	}

	const srcset = (base: string) => `${base}-600.webp 600w, ${base}-1200.webp 1200w`;
</script>

<section id="plateforme" class="relative section-y" aria-labelledby="plateforme-title">
	<SectionHead
		{index}
		label="Plateforme"
		title={{ before: 'Chaque livre a', em: 'son propre monde.' }}
		id="plateforme-title"
	/>
	<p class="mt-8 max-w-[58ch] gutter-x text-lead text-ash lg:ml-[25%]" use:reveal={{ delay: 0.15 }}>
		Notre liseuse prend l’apparence du livre qu’elle ouvre : couleurs, typographie, matières,
		mouvement, son. Elle est en ligne sur
		<a
			href={platform.url}
			target="_blank"
			rel="noopener"
			class="text-bone underline decoration-1 underline-offset-4">{platform.host}</a
		>, avec un catalogue de démonstration.
	</p>

	<div class="grid-cardor mt-16 gap-y-10 md:mt-24">
		<div class="col-span-4 md:col-span-8 lg:col-span-7" use:reveal={{ type: 'block' }}>
			<div
				role="tablist"
				aria-label="Mondes de lecture"
				class="flex flex-wrap gap-2"
				tabindex="-1"
				onkeydown={onKey}
			>
				{#each worlds as world, i (world.id)}
					<button
						type="button"
						role="tab"
						id="world-{world.id}"
						aria-selected={i === current}
						aria-controls="world-page"
						tabindex={i === current ? 0 : -1}
						class={['chip', i === current && 'is-on']}
						onclick={() => (current = i)}
					>
						{world.name}
						<span class="text-ash">· {world.genre}</span>
					</button>
				{/each}
			</div>

			<div id="world-page" role="tabpanel" aria-labelledby="world-{w.id}" class="mt-6">
				<figure>
					<a
						href="{platform.url}lire/{w.slug}"
						target="_blank"
						rel="noopener"
						class="shot stack"
						data-cursor="Lire"
					>
						{#each worlds as world, i (world.id)}
							<img
								src="{world.shot}-1200.webp"
								srcset={srcset(world.shot)}
								sizes="(min-width: 1024px) 56vw, 100vw"
								alt={i === current ? world.alt : ''}
								aria-hidden={i === current ? undefined : 'true'}
								width="1200"
								height="750"
								loading="lazy"
								decoding="async"
								class={['stack-img', i === current && 'is-on']}
							/>
						{/each}
					</a>
					<figcaption class="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
						<span class="text-sm text-ash">
							<em class="text-bone">{w.title}</em> · thème {w.name} · Atelier CM Publishing · démo
						</span>
						<a
							href="{platform.url}lire/{w.slug}"
							target="_blank"
							rel="noopener"
							class="label text-bone underline decoration-1 underline-offset-4 hover:text-signal"
							>Lire ce chapitre ↗</a
						>
					</figcaption>
				</figure>
			</div>
			<p class="mt-4 text-sm text-ash">
				Le Sanctuaire en production, sur les quatre mondes de référence et des livres de
				démonstration. Le texte et les composants restent les mêmes : seul le thème du livre change.
			</p>
		</div>

		<div class="col-span-4 md:col-span-8 lg:col-span-5">
			<ol class="border-t border-smoke">
				{#each platform.spaces as s, i (s.name)}
					<li class="border-b border-smoke py-6" use:reveal={{ type: 'block', delay: i * 0.06 }}>
						<div class="flex items-baseline justify-between gap-4">
							<h3 class="font-display text-h2">{s.name}</h3>
							<span
								class={[
									'shrink-0 rounded-full border px-3 py-1 label',
									s.state === 'En ligne' ? 'border-signal text-signal' : 'border-smoke text-ash'
								]}>{s.state}</span
							>
						</div>
						<p class="mt-2 label text-ash">{s.role}</p>
						<p class="mt-3 text-bone/90">{s.text}</p>
					</li>
				{/each}
			</ol>
			<div class="mt-8 flex flex-wrap items-center gap-3">
				<a
					href={platform.url}
					target="_blank"
					rel="noopener"
					class="cta inline-flex min-h-12 items-center gap-3 rounded-full bg-bone px-6 font-medium text-void"
					data-cursor="Ouvrir">Ouvrir la plateforme ↗</a
				>
				<a
					href={platform.themes}
					target="_blank"
					rel="noopener"
					class="ghost inline-flex min-h-12 items-center rounded-full border border-smoke px-6"
					>Le théâtre des thèmes ↗</a
				>
			</div>
			<p class="mt-3 label text-ash">{platform.host} · {platform.status}</p>
		</div>
	</div>

	<ul class="grid-cardor mt-16 gap-y-8 md:mt-24" aria-label="La plateforme en images">
		{#each hubShots as shot, i (shot.src)}
			<li class="col-span-4 lg:col-span-3" use:reveal={{ type: 'block', delay: i * 0.06 }}>
				<figure>
					<a href={shot.href} target="_blank" rel="noopener" class="shot" data-cursor="Ouvrir">
						<img
							src="{shot.src}-600.webp"
							srcset={srcset(shot.src)}
							sizes="(min-width: 1024px) 24vw, (min-width: 768px) 48vw, 100vw"
							alt={shot.alt}
							width="1200"
							height="750"
							loading="lazy"
							decoding="async"
						/>
					</a>
					<figcaption class="mt-3 label text-ash">{shot.title} ↗</figcaption>
				</figure>
			</li>
		{/each}
	</ul>
	<p class="mt-6 gutter-x text-sm text-ash">
		Captures de {platform.host}. Les livres du catalogue sont des démonstrations, signées « Atelier
		CM Publishing · démo ».
	</p>
</section>

<style>
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		min-height: 2.75rem;
		padding: 0 1rem;
		border: 1px solid var(--color-smoke);
		border-radius: 999px;
		font-size: 0.875rem;
		transition:
			border-color 0.3s,
			background-color 0.3s;
	}
	.chip:hover {
		border-color: var(--color-signal);
	}
	.chip.is-on {
		border-color: var(--color-signal);
		background: color-mix(in oklab, var(--color-signal) 14%, transparent);
	}
	.chip:focus-visible,
	.cta:focus-visible,
	.ghost:focus-visible,
	.shot:focus-visible {
		outline: 2px solid var(--color-signal);
		outline-offset: 3px;
	}

	/* A screenshot of the platform: framed like the house's cards, 16:10, no layout shift. */
	.shot {
		display: block;
		aspect-ratio: 16 / 10;
		overflow: clip;
		border: 1px solid var(--color-smoke);
		background: var(--color-graphite);
		transition: border-color 0.5s var(--ease-cardor-out);
	}
	.shot:hover {
		border-color: var(--color-signal);
	}
	.shot img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* The four worlds share one frame; the selected one fades in over the others. */
	.stack {
		display: grid;
	}
	.stack-img {
		grid-area: 1 / 1;
		opacity: 0;
		transition: opacity 0.8s var(--ease-cardor-out);
	}
	.stack-img.is-on {
		opacity: 1;
	}

	.cta {
		transition: background-color 0.3s;
	}
	.cta:hover {
		background: var(--color-signal);
	}
	.ghost {
		transition: border-color 0.3s;
	}
	.ghost:hover {
		border-color: var(--color-signal);
	}
	@media (prefers-reduced-motion: reduce) {
		.stack-img,
		.shot {
			transition: none;
		}
	}
</style>
