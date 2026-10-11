<script lang="ts">
	import { fly } from 'svelte/transition';
	import { icon } from './icons.ts';
	import { formatDuration } from '#lib/sound/catalog.ts';
	import { close, current, next, player, prev, seek, toggle } from '#lib/sound/player.svelte.ts';
	import { prefersReducedMotion } from '#lib/motion/tokens.ts';

	const track = $derived(current());
	const pct = $derived(player.duration ? (player.time / player.duration) * 100 : 0);
	const reduce = typeof window !== 'undefined' && prefersReducedMotion();

	// Keep the page's last lines above the fixed bar.
	$effect(() => {
		const root = document.documentElement;
		root.style.setProperty('--player-h', track ? '5.5rem' : '0px');
		return () => root.style.removeProperty('--player-h');
	});
</script>

{#if track && player.release}
	<div
		class="bar fixed inset-x-0 bottom-0 z-[70] border-t border-smoke bg-ink/95 backdrop-blur-md"
		role="region"
		aria-label="Lecteur audio"
		transition:fly={{ y: reduce ? 0 : 96, duration: reduce ? 0 : 500 }}
	>
		<input
			type="range"
			class="seek"
			min="0"
			max={player.duration || 0}
			step="0.1"
			value={player.time}
			style:--p="{pct}%"
			oninput={(e) => seek(+e.currentTarget.value)}
			aria-label="Position dans {track.title}"
			aria-valuetext="{formatDuration(player.time)} sur {formatDuration(player.duration)}"
		/>
		<div class="flex items-center gap-3 gutter-x py-3 md:gap-5">
			{#if player.release.cover}
				<img
					src={player.release.cover.web}
					alt=""
					width="48"
					height="48"
					class="size-12 flex-none border border-smoke object-cover max-sm:hidden"
				/>
			{/if}
			<div class="min-w-0 flex-1" aria-live="polite">
				<p class="truncate text-sm md:text-base">{track.title}</p>
				<p class="truncate label text-ash">
					{player.release.title} · {String(track.n).padStart(2, '0')}/{player.release.tracks.length}
					{#if player.error}<span class="text-signal"> · {player.error}</span>{/if}
				</p>
			</div>
			<span class="font-mono text-xs text-ash tabular-nums max-md:hidden">
				{formatDuration(player.time)} / {formatDuration(player.duration)}
			</span>
			<div class="flex items-center gap-1">
				<button type="button" class="ctl" onclick={prev} aria-label="Titre précédent">
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon.prev} class="stroke" /></svg>
				</button>
				<button
					type="button"
					class="ctl main"
					onclick={toggle}
					aria-label={player.playing ? 'Pause' : 'Lecture'}
				>
					{#if player.loading && player.playing}
						<span class="spin" aria-hidden="true"></span>
					{:else}
						<svg viewBox="0 0 24 24" aria-hidden="true"
							><path d={player.playing ? icon.pause : icon.play} /></svg
						>
					{/if}
				</button>
				<button
					type="button"
					class="ctl"
					onclick={next}
					aria-label="Titre suivant"
					disabled={player.index >= player.release.tracks.length - 1}
				>
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon.next} class="stroke" /></svg>
				</button>
				<a
					href={track.url}
					download
					class="ctl max-sm:hidden"
					aria-label="Télécharger {track.title}"
					title="Télécharger"
				>
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon.download} class="stroke" /></svg
					>
				</a>
				<button type="button" class="ctl" onclick={close} aria-label="Fermer le lecteur">
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon.close} class="stroke" /></svg>
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.bar {
		padding-bottom: env(safe-area-inset-bottom);
	}
	.ctl {
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 999px;
		color: var(--color-bone);
		transition:
			color 0.3s,
			background-color 0.3s;
	}
	.ctl svg {
		width: 1.25rem;
		fill: currentColor;
	}
	.ctl:hover {
		color: var(--color-signal);
	}
	.ctl:disabled {
		color: var(--color-smoke);
	}
	.ctl:focus-visible,
	.seek:focus-visible {
		outline: 2px solid var(--color-signal);
		outline-offset: 2px;
	}
	.ctl.main {
		background: var(--color-bone);
		color: var(--color-void);
	}
	.ctl.main:hover {
		background: var(--color-signal);
	}
	.stroke {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.spin {
		width: 1.1rem;
		height: 1.1rem;
		border: 2px solid currentColor;
		border-right-color: transparent;
		border-radius: 999px;
		animation: spin 0.8s linear infinite;
	}
	@keyframes spin {
		to {
			rotate: 1turn;
		}
	}

	/* Seek bar: a hairline across the top of the player, thick enough to grab. */
	.seek {
		position: absolute;
		inset-inline: 0;
		top: -0.6rem;
		width: 100%;
		height: 1.2rem;
		margin: 0;
		appearance: none;
		background: transparent;
		cursor: pointer;
	}
	.seek::-webkit-slider-runnable-track {
		height: 3px;
		background:
			linear-gradient(var(--color-signal), var(--color-signal)) 0 0 / var(--p) 100% no-repeat,
			var(--color-smoke);
	}
	.seek::-moz-range-track {
		height: 3px;
		background:
			linear-gradient(var(--color-signal), var(--color-signal)) 0 0 / var(--p) 100% no-repeat,
			var(--color-smoke);
	}
	.seek::-webkit-slider-thumb {
		appearance: none;
		width: 14px;
		height: 14px;
		margin-top: -5.5px;
		border-radius: 999px;
		background: var(--color-bone);
		border: 0;
	}
	.seek::-moz-range-thumb {
		width: 14px;
		height: 14px;
		border-radius: 999px;
		background: var(--color-bone);
		border: 0;
	}
	@media (prefers-reduced-motion: reduce) {
		.spin {
			animation-duration: 2.4s;
		}
	}
</style>
