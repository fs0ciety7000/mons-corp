<script lang="ts">
	import { onMount } from 'svelte';
	import SectionHead from '#lib/sites/division/SectionHead.svelte';
	import PlayerBar from './PlayerBar.svelte';
	import { icon } from './icons.ts';
	import { reveal } from '#lib/motion/actions.ts';
	import { gsap } from '#lib/motion/gsap.ts';
	import { core } from '#lib/state/core.svelte.ts';
	import { jsonLd } from '#lib/seo/seo.ts';
	import { site } from '#lib/sites/config.ts';
	import {
		formatDuration,
		formatSize,
		isoDuration,
		totalDuration,
		type Release
	} from '#lib/sound/catalog.ts';
	import { dispose, pause, play, player, sample } from '#lib/sound/player.svelte.ts';

	let { releases, index }: { releases: Release[]; index: string } = $props();

	const isCurrent = (r: Release, i: number) => player.release?.id === r.id && player.index === i;
	const isPlaying = (r: Release, i: number) => isCurrent(r, i) && player.playing;

	// schema.org MusicAlbum per release, so search engines see the tracklist.
	const graph = $derived(
		jsonLd({
			'@context': 'https://schema.org',
			'@graph': releases.map((r) => ({
				'@type': 'MusicAlbum',
				name: [r.title, r.subtitle].filter(Boolean).join(' — '),
				albumProductionType: 'https://schema.org/SoundtrackAlbum',
				byArtist: { '@type': 'MusicGroup', name: 'CM Soundworks', url: site.urls.production },
				datePublished: String(r.year),
				image: r.cover?.large,
				description: r.description,
				numTracks: r.tracks.length,
				track: r.tracks.map((t) => ({
					'@type': 'MusicRecording',
					position: t.n,
					name: t.title,
					duration: isoDuration(t.duration),
					url: t.url
				}))
			}))
		})
	);

	// The album player feeds the Core and the waveform; the drone does the same in Listen.
	onMount(() => {
		const tick = () => {
			if (core.soundOwner !== 'player') return;
			core.audio += (sample() - core.audio) * 0.25;
		};
		gsap.ticker.add(tick);
		return () => {
			gsap.ticker.remove(tick);
			dispose();
		};
	});

	// The drone took the speakers back: pause the album.
	$effect(() => {
		if (core.soundOwner !== 'player' && player.playing) pause();
	});
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- serialised JSON-LD, < escaped -->
	{@html graph}
</svelte:head>

<section id="productions" class="relative section-y" aria-labelledby="productions-title">
	<SectionHead
		{index}
		label="Productions"
		title={{ before: 'Ce qui sort', em: 'du studio.' }}
		id="productions-title"
	/>

	{#each releases as r (r.id)}
		{@const total = totalDuration(r)}
		<article class="grid-cardor mt-14 gap-y-10 md:mt-20" aria-labelledby="release-{r.id}">
			{#if r.cover}
				<figure class="col-span-4 md:col-span-4 lg:col-span-5" use:reveal={{ type: 'block' }}>
					<div class="cover relative aspect-square overflow-clip border border-smoke bg-graphite">
						<img
							src={r.cover.web}
							alt={r.cover.alt}
							width="800"
							height="800"
							loading="lazy"
							decoding="async"
							class="size-full object-cover"
						/>
						<button
							type="button"
							class={['cover-play', player.release?.id === r.id && player.playing && 'is-on']}
							onclick={() => play(r, isCurrent(r, player.index) ? player.index : 0)}
							aria-label={player.release?.id === r.id && player.playing
								? `Mettre en pause ${r.title}`
								: `Écouter ${r.title}`}
							data-cursor={player.release?.id === r.id && player.playing ? 'Pause' : 'Écouter'}
						>
							<svg viewBox="0 0 24 24" aria-hidden="true"
								><path
									d={player.release?.id === r.id && player.playing ? icon.pause : icon.play}
								/></svg
							>
						</button>
					</div>
				</figure>
			{/if}

			<div class="col-span-4 flex flex-col md:col-span-4 lg:col-span-7 lg:pl-8">
				<p class="label text-signal" use:reveal>
					{[r.kind, r.year, r.project?.studio].filter(Boolean).join(' · ')}
				</p>
				<h3 id="release-{r.id}" class="mt-4 font-display text-h1" use:reveal={{ type: 'words' }}>
					{r.title}{#if r.subtitle}<em class="block text-h2 text-ash">{r.subtitle}</em>{/if}
				</h3>
				{#if r.description}
					<p class="mt-6 max-w-[56ch] text-bone/90" use:reveal>{r.description}</p>
				{/if}
				<p class="mt-4 label text-ash">
					{r.tracks.length} titres · {Math.round(total / 60)} min
				</p>

				<div class="mt-8 flex flex-wrap items-center gap-3">
					<button
						type="button"
						class="cta inline-flex min-h-12 items-center gap-3 rounded-full bg-bone px-6 text-void"
						onclick={() => play(r, player.release?.id === r.id ? player.index : 0)}
					>
						<svg viewBox="0 0 24 24" class="size-5 fill-current" aria-hidden="true"
							><path
								d={player.release?.id === r.id && player.playing ? icon.pause : icon.play}
							/></svg
						>
						<span class="font-medium"
							>{player.release?.id === r.id && player.playing
								? 'Pause'
								: player.release?.id === r.id
									? 'Reprendre'
									: 'Écouter l’album'}</span
						>
					</button>
					{#if r.download}
						<a
							href={r.download.url}
							download
							class="ghost inline-flex min-h-12 items-center gap-3 rounded-full border border-smoke px-6"
							data-cursor="Télécharger"
						>
							<svg viewBox="0 0 24 24" class="stroke size-5" aria-hidden="true"
								><path d={icon.download} /></svg
							>
							<span>Télécharger l’album</span>
							<span class="font-mono text-xs text-ash">ZIP · {formatSize(r.download.size)}</span>
						</a>
					{/if}
					{#if r.project?.url}
						<a
							href={r.project.url}
							target="_blank"
							rel="noopener"
							class="sub inline-flex min-h-12 items-center px-2 label">Jouer à {r.project.name} ↗</a
						>
					{/if}
				</div>
				{#if r.download}
					<p class="mt-3 font-mono text-xs text-ash">{r.download.label}</p>
				{/if}

				<ol class="mt-10 border-t border-smoke" aria-label="Titres de {r.title}">
					{#each r.tracks as t, i (t.id)}
						<li class={['row', isCurrent(r, i) && 'is-current']}>
							<button
								type="button"
								class="row-main"
								onclick={() => play(r, i)}
								aria-label="{isPlaying(r, i) ? 'Pause' : 'Écouter'} : {t.title}"
								aria-current={isCurrent(r, i) ? 'true' : undefined}
							>
								<span class="num" aria-hidden="true">
									{#if isPlaying(r, i)}
										<span class="bars"><i></i><i></i><i></i></span>
									{:else}
										<span class="n">{String(t.n).padStart(2, '0')}</span>
										<svg viewBox="0 0 24 24" class="hover-play" aria-hidden="true"
											><path d={icon.play} /></svg
										>
									{/if}
								</span>
								<span class="min-w-0 flex-1">
									<span class="block md:truncate">{t.title}</span>
									{#if t.note}<span class="block text-sm text-ash md:truncate">{t.note}</span>{/if}
								</span>
								<span class="font-mono text-xs text-ash tabular-nums">
									{formatDuration(t.duration)}
								</span>
							</button>
							<a
								href={t.url}
								download
								class="dl"
								aria-label="Télécharger {t.title} ({t.format}, {formatSize(t.size)})"
								title="Télécharger · {formatSize(t.size)}"
								data-cursor="Télécharger"
							>
								<svg viewBox="0 0 24 24" class="stroke size-5" aria-hidden="true"
									><path d={icon.download} /></svg
								>
							</a>
						</li>
					{/each}
				</ol>

				{#if r.credits}
					<p class="mt-6 max-w-[64ch] text-sm text-ash">{r.credits}</p>
				{/if}
			</div>
		</article>
	{/each}
</section>

<PlayerBar />

<style>
	.cover img {
		transition: scale 1.2s var(--ease-cardor-out);
	}
	.cover:hover img {
		scale: 1.03;
	}
	/* Centred over the artwork, shown on hover / focus / while playing (always on touch screens). */
	.cover-play {
		position: absolute;
		inset: 0;
		margin: auto;
		opacity: 0;
		display: grid;
		place-items: center;
		width: 4.5rem;
		height: 4.5rem;
		border-radius: 999px;
		background: var(--color-bone);
		color: var(--color-void);
		box-shadow: 0 0 0 0 color-mix(in oklab, var(--color-signal) 50%, transparent);
		transition:
			scale 0.5s var(--ease-cardor-out),
			box-shadow 0.6s var(--ease-cardor-out),
			background-color 0.3s,
			opacity 0.4s;
	}
	.cover-play svg {
		width: 1.75rem;
		fill: currentColor;
	}
	.cover:hover .cover-play,
	.cover-play:focus-visible,
	.cover-play.is-on {
		opacity: 1;
	}
	@media (hover: none) {
		.cover-play {
			opacity: 1;
		}
	}
	.cover-play:hover,
	.cover-play:focus-visible {
		scale: 1.06;
		background: var(--color-signal);
		box-shadow: 0 0 0 10px color-mix(in oklab, var(--color-signal) 18%, transparent);
	}
	.cover-play:focus-visible,
	.row-main:focus-visible,
	.dl:focus-visible,
	.cta:focus-visible,
	.ghost:focus-visible {
		outline: 2px solid var(--color-signal);
		outline-offset: 3px;
	}
	.stroke {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.cta {
		transition: background-color 0.3s;
	}
	.cta:hover {
		background: var(--color-signal);
	}
	.cta:active,
	.ghost:active {
		scale: 0.97;
	}
	.ghost {
		transition: border-color 0.3s;
	}
	.ghost:hover {
		border-color: var(--color-signal);
	}
	.sub {
		color: var(--color-ash);
		transition: color 0.3s;
	}
	.sub:hover,
	.sub:focus-visible {
		color: var(--color-signal);
	}

	.row {
		display: flex;
		align-items: stretch;
		border-bottom: 1px solid var(--color-smoke);
		transition: background-color 0.3s;
	}
	.row:hover,
	.row.is-current {
		background: color-mix(in oklab, var(--color-signal) 7%, transparent);
	}
	.row.is-current .row-main > span:nth-child(2) > span:first-child {
		color: var(--color-signal);
	}
	.row-main {
		display: flex;
		flex: 1;
		min-width: 0;
		align-items: center;
		gap: 1rem;
		min-height: 3.5rem;
		padding: 0.6rem 0.75rem 0.6rem 0.25rem;
		text-align: left;
	}
	.num {
		position: relative;
		display: grid;
		place-items: center;
		width: 2rem;
		flex: none;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-ash);
	}
	.hover-play {
		position: absolute;
		width: 1rem;
		fill: var(--color-signal);
		opacity: 0;
	}
	.row-main:hover .n,
	.row-main:focus-visible .n {
		opacity: 0;
	}
	.row-main:hover .hover-play,
	.row-main:focus-visible .hover-play {
		opacity: 1;
	}
	.dl {
		display: grid;
		place-items: center;
		width: 3rem;
		flex: none;
		color: var(--color-ash);
		transition: color 0.3s;
	}
	.dl:hover {
		color: var(--color-signal);
	}
	.bars {
		display: inline-flex;
		align-items: flex-end;
		gap: 2px;
		height: 12px;
	}
	.bars i {
		width: 2px;
		height: 100%;
		background: var(--color-signal);
		animation: eq 0.8s ease-in-out infinite alternate;
	}
	.bars i:nth-child(2) {
		animation-delay: -0.3s;
	}
	.bars i:nth-child(3) {
		animation-delay: -0.55s;
	}
	@keyframes eq {
		from {
			height: 25%;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.bars i {
			animation: none;
			height: 70%;
		}
		.cover img,
		.cover-play {
			transition: none;
		}
	}
</style>
