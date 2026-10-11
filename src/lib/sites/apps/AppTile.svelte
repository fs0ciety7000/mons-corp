<script lang="ts">
	import { accessLabels, host, kindLabels, type AppEntry } from './catalog.ts';
	import type { Probe } from './status.svelte.ts';

	let {
		app,
		color,
		probe,
		view,
		onopen
	}: {
		app: AppEntry;
		color: string;
		probe: Probe | undefined;
		view: 'tuiles' | 'dock';
		onopen: (id: string) => void;
	} = $props();

	const state = $derived(probe === undefined ? 'unknown' : probe.up ? 'up' : 'down');
	const stateLabel = $derived(
		state === 'unknown' ? 'Vérification…' : state === 'up' ? app.status : 'Injoignable'
	);
</script>

{#if view === 'dock'}
	<a
		href={app.url}
		target="_blank"
		rel="noopener"
		class="dock group"
		style:--division={color}
		data-cursor="Ouvrir"
		data-app={app.id}
		onclick={() => onopen(app.id)}
	>
		<span class="dock-icon">
			<img src={app.icon} alt="" width="256" height="256" loading="lazy" decoding="async" />
			<span class={['dot', state]} aria-hidden="true"></span>
		</span>
		<span class="mt-3 block text-center text-sm leading-tight">{app.name}</span>
		<span class="mt-1 block text-center label text-ash">{kindLabels[app.kind]}</span>
		<span class="sr-only">, {stateLabel}, s'ouvre dans un nouvel onglet</span>
	</a>
{:else}
	<article class="tile group" style:--division={color} data-app={app.id}>
		<div class="relative aspect-[16/10] overflow-clip border-b border-smoke bg-graphite">
			<img
				src={app.cover}
				alt=""
				loading="lazy"
				decoding="async"
				width="1200"
				height="750"
				class="size-full object-cover transition-transform duration-[1.2s] ease-(--ease-cardor-out) group-hover:scale-[1.04]"
			/>
			<span class="veil" aria-hidden="true"></span>
			<span
				class="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-void/80 px-3 py-1.5 label backdrop-blur"
			>
				<span class={['dot', state]} aria-hidden="true"></span>{stateLabel}
			</span>
			{#if app.access !== 'public'}
				<span
					class="absolute top-3 right-3 rounded-full border border-bone/30 bg-void/80 px-3 py-1.5 label backdrop-blur"
					>{accessLabels[app.access]}</span
				>
			{/if}
		</div>

		<div class="relative flex flex-1 flex-col gap-3 px-5 pt-0 pb-5 md:px-6">
			<img
				src={app.icon}
				alt=""
				width="256"
				height="256"
				loading="lazy"
				decoding="async"
				class="icon -mt-8 size-16 rounded-2xl border border-smoke bg-ink object-cover"
			/>
			<div class="flex items-baseline justify-between gap-3">
				<h3 class="font-display text-h2 leading-none">
					<a
						href={app.url}
						target="_blank"
						rel="noopener"
						class="stretched"
						data-cursor="Ouvrir"
						onclick={() => onopen(app.id)}
						>{app.name}<span class="sr-only">, s'ouvre dans un nouvel onglet</span></a
					>
				</h3>
				<span
					class="label text-ash transition-[color,translate] duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-(--division)"
					aria-hidden="true">↗</span
				>
			</div>
			<p class="label text-ash">{app.category}</p>
			<p class="text-bone/90">{app.pitch}</p>
			<ul class="flex flex-wrap gap-1.5" aria-label="Plateformes">
				{#each app.platforms as p (p)}
					<li
						class="rounded-full border border-smoke px-2.5 py-1 font-mono text-[0.6875rem] text-ash"
					>
						{p}
					</li>
				{/each}
			</ul>
			<div
				class="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-smoke pt-4"
			>
				<span class="font-mono text-xs text-ash">{host(app.url)}</span>
				{#if app.links?.length}
					<span class="relative z-10 flex flex-wrap gap-3">
						{#each app.links as l (l.url)}
							<a
								href={l.url}
								target="_blank"
								rel="noopener"
								class="sub label"
								onclick={() => onopen(app.id)}>{l.label} ↗</a
							>
						{/each}
					</span>
				{/if}
			</div>
		</div>
	</article>
{/if}

<style>
	.tile {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		border: 1px solid var(--color-smoke);
		background: var(--color-ink);
		transition:
			border-color 0.5s var(--ease-cardor-out),
			translate 0.6s var(--ease-cardor-out);
	}
	.tile:hover,
	.tile:focus-within {
		border-color: color-mix(in oklab, var(--division) 55%, var(--color-smoke));
		translate: 0 -4px;
	}
	/* The whole tile opens the project; secondary links sit above this layer. */
	.stretched::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
	}
	.stretched:focus-visible {
		outline: none;
	}
	.tile:has(.stretched:focus-visible) {
		outline: 2px solid var(--division);
		outline-offset: 3px;
	}
	.veil {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			color-mix(in oklab, var(--division) 26%, transparent),
			transparent 55%
		);
		opacity: 0;
		transition: opacity 0.6s var(--ease-cardor-out);
	}
	.tile:hover .veil {
		opacity: 1;
	}
	.icon {
		position: relative;
		box-shadow: 0 0 0 4px var(--color-ink);
		transition: translate 0.6s var(--ease-cardor-out);
	}
	.tile:hover .icon {
		translate: 0 -4px;
	}
	.sub {
		color: var(--color-ash);
		background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat;
		transition:
			color 0.3s,
			background-size 0.5s var(--ease-cardor-out);
	}
	.sub:hover,
	.sub:focus-visible {
		color: var(--division);
		background-size: 100% 1px;
	}

	.dock {
		display: block;
		padding: 1rem 0.5rem;
		border-radius: 1.25rem;
		transition: background-color 0.4s;
	}
	.dock:hover,
	.dock:focus-visible {
		background: color-mix(in oklab, var(--division) 10%, transparent);
	}
	.dock:focus-visible {
		outline: 2px solid var(--division);
		outline-offset: 2px;
	}
	.dock-icon {
		position: relative;
		display: block;
		margin-inline: auto;
		width: clamp(4.5rem, 9vw, 6rem);
		aspect-ratio: 1;
		transition:
			translate 0.5s var(--ease-cardor-out),
			scale 0.5s var(--ease-cardor-out);
	}
	.dock-icon img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 22%;
		border: 1px solid var(--color-smoke);
		background: var(--color-ink);
	}
	.dock:hover .dock-icon {
		translate: 0 -6px;
		scale: 1.06;
	}
	.dock-icon .dot {
		position: absolute;
		right: -2px;
		bottom: -2px;
		box-shadow: 0 0 0 3px var(--color-void);
	}

	.dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 999px;
		background: var(--color-ash);
		flex: none;
	}
	.dot.up {
		background: var(--division);
		box-shadow: 0 0 0 0 color-mix(in oklab, var(--division) 60%, transparent);
		animation: pulse 2.4s var(--ease-cardor-out) infinite;
	}
	.dot.down {
		background: var(--color-ember);
	}
	@keyframes pulse {
		70% {
			box-shadow: 0 0 0 6px transparent;
		}
		100% {
			box-shadow: 0 0 0 0 transparent;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.tile,
		.icon,
		.dock-icon {
			transition: none;
		}
		.dot.up {
			animation: none;
		}
	}
</style>
