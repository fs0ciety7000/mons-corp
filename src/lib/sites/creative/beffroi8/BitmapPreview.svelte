<script lang="ts">
	import { onMount } from 'svelte';
	import { onFirstView } from '#lib/motion/tokens.ts';
	import { drawBitmapText, loadBitmapFont, type LoadedBitmapFont } from './bitmap.ts';
	import { asset } from './specimen.ts';
	import type { FontStyle } from './types.ts';

	/**
	 * « Canvas maison »: the same text drawn from the BMFont atlas (`.json` + `.png`), the way
	 * a game engine would. Nothing is fetched until the figure scrolls into view.
	 */
	let {
		style,
		text,
		size,
		color
	}: { style: FontStyle; text: string; size: number; color: string } = $props();

	let host = $state<HTMLElement>();
	let canvas = $state<HTMLCanvasElement>();
	let visible = $state(false);
	let font = $state.raw<LoadedBitmapFont | null>(null);
	let failed = $state(false);
	let width = $state(0);
	let dpr = $state(1);

	const scale = $derived(Math.max(1, Math.round(size / style.grid)));

	onMount(() => {
		dpr = window.devicePixelRatio || 1;
		const ro = new ResizeObserver(([e]) => {
			width = Math.floor(e.contentRect.width);
			dpr = window.devicePixelRatio || 1;
		});
		ro.observe(host!);
		// Observe the section, not the canvas: the figure's clip-path entrance (use:wipe) hides
		// its content from IntersectionObserver until it has played.
		const target = host!.closest('section') ?? host!;
		const stop = onFirstView(target, () => (visible = true), '200px 0px 200px 0px');
		return () => {
			stop();
			ro.disconnect();
		};
	});

	// Load (or switch) the atlas of the chosen style, only once the preview is on screen.
	$effect(() => {
		if (!visible) return;
		const s = style;
		let alive = true;
		failed = false;
		loadBitmapFont(asset(s.files.json), asset(s.files.png))
			.then((f) => {
				if (alive) font = f;
			})
			.catch(() => {
				if (alive) failed = true;
			});
		return () => {
			alive = false;
		};
	});

	// Redraw on every input change: no animation loop (CLAUDE.md §6.3).
	$effect(() => {
		if (!font || !canvas || !width) return;
		drawBitmapText(canvas, font, text || ' ', {
			scale,
			color,
			maxCssWidth: width,
			dpr
		});
	});
</script>

<div bind:this={host} class="w-full" style="min-height: {size * 1.25}px">
	{#if failed}
		<p class="text-ash">L’atlas bitmap n’a pas pu être chargé.</p>
	{:else}
		<canvas
			bind:this={canvas}
			width="0"
			height="0"
			class="pixelated block max-w-full"
			aria-hidden="true"
		></canvas>
		{#if !font}<p class="label text-ash">Chargement de l’atlas…</p>{/if}
	{/if}
</div>
