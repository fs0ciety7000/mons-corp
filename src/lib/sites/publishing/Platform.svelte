<script lang="ts">
	import SectionHead from '#lib/sites/division/SectionHead.svelte';
	import { reveal } from '#lib/motion/actions.ts';
	import { platform, worlds } from './content.ts';

	let { index }: { index: string } = $props();

	// The chameleon reader: the same page wears each book's world (cardor-publishing's promise).
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
		mouvement. Le thème est une donnée, et la lecture reste toujours la priorité.
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

			<div
				id="world-page"
				role="tabpanel"
				aria-labelledby="world-{w.id}"
				aria-live="polite"
				class="page mt-6"
				style:--w-bg={w.bg}
				style:--w-ink={w.ink}
				style:--w-accent={w.accent}
				data-font={w.font}
				data-style={w.style}
				data-cursor="Lire"
			>
				<p class="page-genre">{w.genre} · Atelier CM Publishing · démo</p>
				<p class="page-title">{w.title}</p>
				<p class="page-hook">« {w.hook} »</p>
				<span class="page-rule" aria-hidden="true"></span>
				<p class="page-meta">Thème {w.name}</p>
			</div>
			<p class="mt-4 text-sm text-ash">
				Les quatre mondes de référence de la liseuse, sur des livres de démonstration. Dans le
				Sanctuaire, ils changent aussi la matière du papier, le rythme et le son.
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
			<p class="mt-3 label text-ash">{platform.status}</p>
		</div>
	</div>
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
	.ghost:focus-visible {
		outline: 2px solid var(--color-signal);
		outline-offset: 3px;
	}

	/* The book page: its colours come from the selected world, the rhythm from the house tokens. */
	.page {
		position: relative;
		min-height: clamp(18rem, 34vw, 26rem);
		padding: clamp(1.5rem, 4vw, 3.5rem);
		background: var(--w-bg);
		color: var(--w-ink);
		box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--w-ink) 14%, transparent);
		transition:
			background-color 0.8s var(--ease-cardor-out),
			color 0.8s var(--ease-cardor-out);
	}
	.page-genre,
	.page-meta {
		font-family: var(--font-mono);
		font-size: var(--text-micro);
		letter-spacing: var(--text-micro--letter-spacing);
		text-transform: uppercase;
		opacity: 0.75;
	}
	.page-title {
		margin-top: 2.5rem;
		font-size: var(--text-h1);
		line-height: var(--text-h1--line-height);
		letter-spacing: var(--text-h1--letter-spacing);
		color: var(--w-accent);
		transition: color 0.8s var(--ease-cardor-out);
	}
	.page-hook {
		margin-top: 1.5rem;
		max-width: 34ch;
		font-size: var(--text-lead);
		line-height: var(--text-lead--line-height);
	}
	.page-rule {
		display: block;
		width: 4rem;
		height: 2px;
		margin-top: 2rem;
		background: var(--w-accent);
		transition: width 0.8s var(--ease-cardor-out);
	}
	.page-meta {
		margin-top: 1rem;
	}
	.page[data-font='display'] .page-title,
	.page[data-font='display'] .page-hook {
		font-family: var(--font-display);
	}
	.page[data-font='mono'] .page-title,
	.page[data-font='mono'] .page-hook {
		font-family: var(--font-mono);
		letter-spacing: 0;
	}
	.page[data-style='italic'] .page-title,
	.page[data-style='italic'] .page-hook {
		font-style: italic;
	}
	.page[data-style='smallcaps'] .page-title {
		font-variant: small-caps;
		letter-spacing: 0.02em;
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
		.page,
		.page-title,
		.page-rule {
			transition: none;
		}
	}
</style>
