<script lang="ts">
	import { onMount, tick } from 'svelte';
	import sprite from '#lib/assets/logos.svg?url';
	import { logos, type LogoName } from '#lib/data/logos.ts';
	import {
		drawInTimeline,
		emblemTimeline,
		loadEmblem,
		type EmblemParts
	} from '#lib/brand/emblem-motion.ts';
	import { prefersReducedMotion } from '#lib/motion/tokens.ts';

	interface Props {
		name: LogoName;
		/** color = brand colours · mono = currentColor */
		variant?: 'color' | 'mono';
		/** Mono (currentColor) at rest, brand colours on hover of `host` (docs/brand/emblem-motion.md). */
		swap?: boolean;
		/** Part-by-part signature motion: on hover of `host`, or looping while visible. */
		animate?: 'hover' | 'loop';
		/** Closest ancestor (CSS selector) that triggers hover. Defaults to the parent element. */
		host?: string;
		/** Draw the outlines in, then fill, the first time the emblem scrolls into view. */
		drawIn?: boolean;
		/** Called once the emblem is inlined, with its animatable parts. */
		onready?: (parts: EmblemParts) => void;
		/** Accessible label. Omit for decorative use. */
		title?: string;
		class?: string;
	}

	let {
		name,
		variant = 'color',
		swap = false,
		animate,
		host,
		drawIn = false,
		onready,
		title,
		class: className = ''
	}: Props = $props();

	const meta = $derived(logos[name]);
	// <use> on a <symbol> renders at (0,0): normalise the outer viewBox to the symbol's size.
	const size = $derived(meta.viewBox.split(' ').slice(2).map(Number));

	let svg: SVGSVGElement;
	let markup = $state<string | null>(null);

	// Mono: base tone follows currentColor; detail tones are darkened, the wheel hub is cut out.
	const style = $derived(
		[
			`aspect-ratio: ${meta.ratio}`,
			...(variant === 'mono' && !swap
				? [
						'--logo-t1: currentColor',
						name === 'cardor-monogram'
							? '--logo-t2: transparent'
							: '--logo-t2: color-mix(in oklab, currentColor 45%, black)',
						'--logo-t3: currentColor'
					]
				: [])
		].join(';')
	);

	onMount(() => {
		const hostEl = (host ? svg.closest<HTMLElement>(host) : null) ?? svg.parentElement;
		if (swap) hostEl?.setAttribute('data-emblem-host', '');
		if (!animate && !onready && !drawIn) return;

		let disposed = false;
		const cleanups: Array<() => void> = [];

		(async () => {
			try {
				markup = await loadEmblem(name);
			} catch {
				return; // keep the static sprite
			}
			await tick();
			if (disposed) return;
			const root = svg.querySelector<SVGGElement>('g[data-root]');
			if (!root) return;
			const { tl, parts } = emblemTimeline(
				name,
				root,
				logos[name].viewBox.split(' ').map(Number)[2]
			);
			onready?.(parts);
			cleanups.push(() => tl.kill());
			const reduce = prefersReducedMotion();
			let ready = Promise.resolve();
			if (drawIn && !reduce) {
				const draw = drawInTimeline(root);
				cleanups.push(() => draw.kill());
				ready = new Promise<void>((resolve) => {
					const io = new IntersectionObserver(
						([e]) => {
							if (!e.isIntersecting) return;
							io.disconnect();
							draw.play().then(() => resolve());
						},
						{ threshold: 0.35 }
					);
					io.observe(svg);
					cleanups.push(() => io.disconnect());
				});
			}
			if (!animate || reduce) return;
			await ready;
			if (disposed) return;

			const play = () => {
				if (!tl.isActive()) tl.restart();
			};
			hostEl?.addEventListener('pointerenter', play);
			hostEl?.addEventListener('focusin', play);
			cleanups.push(() => {
				hostEl?.removeEventListener('pointerenter', play);
				hostEl?.removeEventListener('focusin', play);
			});

			if (animate === 'loop') {
				let timer: ReturnType<typeof setInterval> | undefined;
				const io = new IntersectionObserver(([e]) => {
					clearInterval(timer);
					if (e.isIntersecting) {
						play();
						timer = setInterval(play, 5200);
					}
				});
				io.observe(svg);
				cleanups.push(() => {
					io.disconnect();
					clearInterval(timer);
				});
			}
		})();

		return () => {
			disposed = true;
			cleanups.forEach((fn) => fn());
		};
	});
</script>

<svg
	bind:this={svg}
	viewBox={markup ? meta.viewBox : `0 0 ${size[0]} ${size[1]}`}
	class={['logo', swap && 'is-swap', className]}
	{style}
	role={title ? 'img' : undefined}
	aria-hidden={title ? undefined : 'true'}
	aria-label={title}
	data-logo={name}
>
	{#if markup}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- first-party brand SVG from /brand -->
		<g data-root>{@html markup}</g>
	{:else}
		<use href="{sprite}#{name}" width={size[0]} height={size[1]} />
	{/if}
</svg>

<style>
	.logo {
		display: block;
		overflow: visible;
	}
</style>
