<script lang="ts">
	import { onMount, tick } from 'svelte';
	import sprite from '#lib/assets/logos.svg?url';
	import { logos, type LogoName } from '#lib/data/logos.ts';
	import {
		emblemMotion,
		loadEmblem,
		revealTimeline,
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
		/** Per-motif reveal (pen draw, bars rising, glitch boot) the first time it scrolls into view. */
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
			const { build, parts } = emblemMotion(name, root, logos[name].viewBox.split(' ').map(Number));
			onready?.(parts);
			const reduce = prefersReducedMotion();
			if (reduce) return;

			let current: gsap.core.Timeline | null = null;
			let revealing = false;
			const play = () => {
				if (revealing || current?.isActive() || document.hidden) return;
				current?.kill();
				current = build();
			};
			cleanups.push(() => current?.kill());

			// First view: per-motif reveal. Played when ≥1% visible, or after 4 s at the latest
			// so a clipped emblem can never stay invisible (Motion review).
			if (drawIn) {
				const reveal = revealTimeline(name, root);
				revealing = true;
				const start = () => {
					io.disconnect();
					clearTimeout(fallback);
					reveal.play().then(() => (revealing = false));
				};
				const io = new IntersectionObserver(([e]) => e.isIntersecting && start(), {
					threshold: 0.01
				});
				io.observe(svg);
				const fallback = setTimeout(() => {
					if (svg.getBoundingClientRect().top < innerHeight) start();
				}, 4000);
				cleanups.push(() => {
					io.disconnect();
					clearTimeout(fallback);
					reveal.kill();
				});
			}
			if (!animate) return;

			hostEl?.addEventListener('pointerenter', play);
			hostEl?.addEventListener('focusin', play);
			cleanups.push(() => {
				hostEl?.removeEventListener('pointerenter', play);
				hostEl?.removeEventListener('focusin', play);
			});

			// Loop: only while in view, every 12 s ("Silence" principle), paused when hidden.
			if (animate === 'loop') {
				let timer: ReturnType<typeof setInterval> | undefined;
				const io = new IntersectionObserver(([e]) => {
					clearInterval(timer);
					if (e.isIntersecting) {
						setTimeout(play, revealing ? 2600 : 300);
						timer = setInterval(play, 12000);
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
