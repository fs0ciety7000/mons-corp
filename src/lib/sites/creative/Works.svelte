<script lang="ts">
	import SectionHead from '#lib/sites/division/SectionHead.svelte';
	import { catalog } from '#lib/sites/apps/catalog.ts';
	import { reveal } from '#lib/motion/actions.ts';
	import { site } from '#lib/sites/config.ts';
	import type { DivisionContent } from '#lib/sites/division/types.ts';
	import '#lib/sites/creative/beffroi8/pixel.css';
	import { crisp, wipe } from '#lib/sites/creative/beffroi8/crisp.ts';
	import {
		fontFaces,
		NNBSP,
		pixelVars,
		primary,
		pua
	} from '#lib/sites/creative/beffroi8/specimen.ts';

	let { soon, index }: { soon: NonNullable<DivisionContent['soon']>; index: string } = $props();

	/** The atelier's published works: single source with the app launcher (ADR-012). */
	const works = catalog.filter((a) => a.studio === 'creative');
	const sample = `Ça déménage${NNBSP}! ♥ ★ ${pua(0xe000)}`;
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- @font-face built from the synced manifest -->
	{@html `<style>${fontFaces}</style>`}
</svelte:head>

<section id="planches" class="relative section-y" aria-labelledby="planches-title">
	<SectionHead {index} label="Productions" title={soon.title} id="planches-title" />
	<p class="mt-8 max-w-[56ch] gutter-x text-lead text-ash lg:ml-[25%]" use:reveal={{ delay: 0.15 }}>
		{soon.text}
	</p>

	<ul class="grid-cardor mt-12 gap-y-6">
		<!-- First in-house production: the Beffroi 8 pixel font (its specimen lives on this site). -->
		<li class="col-span-4 lg:col-span-3">
			<a href="/beffroi-8" class="work group" data-cursor="Essayer" use:wipe>
				<div
					class="relative grid aspect-[16/10] place-items-center overflow-clip border-b border-smoke bg-graphite"
					aria-hidden="true"
				>
					<div class="flex flex-col items-center gap-4" use:crisp>
						<span class="pixel" style={pixelVars(primary, 6)}>Beffroi 8</span>
						<span class="pixel text-signal" style={pixelVars(primary, 2)}>{sample}</span>
					</div>
				</div>
				<div class="flex flex-1 flex-col gap-3 p-6 md:p-8">
					<div class="flex items-baseline justify-between gap-4">
						<h3 class="font-display text-h2">Beffroi 8</h3>
						<span
							class="label text-ash transition-colors group-hover:text-signal"
							aria-hidden="true">→</span
						>
					</div>
					<p class="label text-ash">Police pixel · Typographie de jeu</p>
					<p class="font-display text-lead italic">
						La police maison des jeux rétro de CM Interactive : essai, glyphes, téléchargements.
					</p>
				</div>
			</a>
		</li>
		{#each works as w (w.id)}
			<li class="col-span-4 lg:col-span-3">
				<a
					href={w.url}
					target="_blank"
					rel="noopener"
					class="work group"
					use:reveal={{ type: 'block' }}
				>
					<div class="relative aspect-[16/10] overflow-clip border-b border-smoke bg-graphite">
						<img
							src={w.cover}
							alt="{w.name} — {w.category}"
							loading="lazy"
							decoding="async"
							width="1200"
							height="750"
							class="size-full object-cover transition-transform duration-[1.2s] ease-(--ease-cardor-out) group-hover:scale-[1.04]"
						/>
					</div>
					<div class="flex flex-1 flex-col gap-3 p-6 md:p-8">
						<div class="flex items-baseline justify-between gap-4">
							<h3 class="font-display text-h2">{w.name}</h3>
							<span
								class="label text-ash transition-colors group-hover:text-signal"
								aria-hidden="true">↗</span
							>
						</div>
						<p class="label text-ash">{w.category}</p>
						<p class="font-display text-lead italic">{w.pitch}</p>
					</div>
				</a>
			</li>
		{/each}
	</ul>

	<p class="mt-10 gutter-x text-ash lg:ml-[25%]">
		Une histoire à faire naître ?
		<a
			href="mailto:{site.email}"
			class="text-bone underline decoration-1 underline-offset-4 hover:text-signal">{site.email}</a
		>
	</p>
</section>

<style>
	.work {
		display: flex;
		flex-direction: column;
		height: 100%;
		border: 1px solid var(--color-smoke);
		background: var(--color-ink);
		transition: border-color 0.5s var(--ease-cardor-out);
	}
	.work:hover,
	.work:focus-visible {
		border-color: color-mix(in oklab, var(--color-signal) 50%, var(--color-smoke));
	}
</style>
