<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import CoreCanvas from '#lib/components/hero/CoreCanvas.svelte';
	import Logo from '#lib/components/brand/Logo.svelte';
	import { core, setCoreState } from '#lib/state/core.svelte.ts';
	import { site, siteUrl } from '#lib/sites/config.ts';
	import { gsap, SplitText } from '#lib/motion/gsap.ts';
	import { duration, ease, prefersReducedMotion } from '#lib/motion/tokens.ts';
	import { magnetic } from '#lib/motion/actions.ts';
	import type { DivisionContent } from './types.ts';

	let { hero, signature }: { hero: DivisionContent['hero']; signature?: Snippet } = $props();

	let root = $state<HTMLElement>();
	let title: HTMLElement;
	let timeline: gsap.core.Timeline | null = null;

	// The Core is locked on this division's state (docs/sites/README.md).
	setCoreState(site.coreState);

	const glitch = site.id === 'interactive';
	const italic = site.id !== 'interactive';
	const size = `clamp(4rem, ${Math.min(24, 150 / site.short.length)}vw, 34rem)`;

	onMount(() => {
		const reduce = prefersReducedMotion();
		const ctx = gsap.context(() => {
			if (reduce) {
				timeline = gsap
					.timeline({ paused: true })
					.fromTo('[data-dhero]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
				return;
			}
			const chars = SplitText.create(title, {
				type: 'chars',
				mask: glitch ? undefined : 'chars',
				aria: 'none'
			}).chars;
			const lines = SplitText.create('[data-dhero-lines]', {
				type: 'lines',
				mask: 'lines',
				aria: 'none'
			}).lines;
			gsap.set('[data-dhero]', { autoAlpha: 1 });

			timeline = gsap.timeline({ paused: true, defaults: { ease: ease.out } });
			if (glitch) {
				// Interactive: characters flicker in out of order, like a corrupted frame resolving.
				timeline.from(
					chars,
					{ autoAlpha: 0, duration: 0.05, stagger: { each: 0.035, from: 'random' }, ease: 'none' },
					0.5
				);
				timeline.fromTo(
					title,
					{ skewX: -14, x: -18 },
					{ skewX: 0, x: 0, duration: 0.5, ease: 'steps(6)' },
					0.5
				);
			} else {
				timeline.from(
					chars,
					{
						yPercent: 112,
						rotate: site.id === 'creative' ? -6 : 0,
						// Publishing: letters rise like pages lifting off the press.
						rotationX: site.id === 'publishing' ? -70 : 0,
						transformOrigin: '50% 100%',
						duration: site.id === 'sound' ? duration.lg * 1.2 : duration.lg,
						stagger: 0.045
					},
					0.5
				);
			}
			timeline
				.from(lines, { yPercent: 100, duration: duration.md, stagger: 0.08 }, 1.0)
				.from('[data-dhero-emblem]', { autoAlpha: 0, scale: 0.8, duration: 1.2 }, 1.1)
				.from('[data-dhero-cta]', { autoAlpha: 0, y: 16, duration: duration.md }, 1.4);
		}, root);
		return () => ctx.revert();
	});

	$effect(() => {
		if (core.ready) timeline?.play();
	});
</script>

<section
	bind:this={root}
	class="relative flex h-svh min-h-[680px] flex-col overflow-clip select-none"
	aria-labelledby="hero-title"
>
	<CoreCanvas trigger={root} />
	<div class="pointer-events-none absolute inset-0 hero-scrim" aria-hidden="true"></div>

	<div data-dhero class="invisible relative z-10 flex flex-1 flex-col pt-24 md:pt-28">
		<div class="flex items-start justify-between gap-6 gutter-x text-ash">
			<p data-dhero-lines class="max-w-[26ch] label">{hero.kicker}</p>
			<p data-dhero-lines class="hidden text-right label md:block">{hero.meta}</p>
		</div>

		<div class="my-auto gutter-x pt-10 md:pt-0">
			<!-- One h1 carrying the full studio name (SEO), styled as two lines. -->
			<h1 id="hero-title">
				<span
					data-dhero-lines
					class="mb-3 block font-mono text-sm tracking-[0.6em] text-signal md:text-base">CM</span
				>
				<!-- The animated letters are hidden from screen readers; this copy is read instead. -->
				<span class="sr-only">{site.short}</span>
				<span
					bind:this={title}
					aria-hidden="true"
					class={[
						'block font-display leading-[0.82] tracking-[-0.035em] whitespace-nowrap',
						italic && 'italic'
					]}
					style:font-size={size}>{site.short}</span
				>
			</h1>
		</div>

		<div class="grid-cardor items-end gap-y-8 pb-8 md:pb-10">
			<div class="col-span-4 flex flex-col gap-6 md:col-span-5 lg:col-span-5">
				<p data-dhero-lines class="max-w-[38ch] text-lead text-bone/90">{hero.lead}</p>
				<div data-dhero-cta class="flex flex-wrap items-center gap-4">
					<a
						href={hero.cta.href}
						use:magnetic={0.3}
						class="cta relative inline-flex items-center gap-3 overflow-clip rounded-full bg-signal px-6 py-3.5 font-medium text-void"
						data-cursor={site.cursorLabel}
					>
						{hero.cta.label} <span aria-hidden="true">→</span>
					</a>
					{@render signature?.()}
				</div>
			</div>
			<div
				class="col-span-4 flex items-end justify-between gap-6 md:col-span-3 lg:col-span-4 lg:col-start-9"
			>
				<a
					href={siteUrl('holding')}
					class="label text-ash transition-colors hover:text-bone"
					data-cursor="Maison">Une division de<br />CARDOR Media ↗</a
				>
				<div data-dhero-emblem class="h-24 w-28 shrink-0 md:h-32 md:w-36" aria-hidden="true">
					<Logo
						name={site.emblem}
						animate="loop"
						drawIn
						host="[data-dhero-emblem]"
						class="size-full"
					/>
				</div>
			</div>
		</div>
	</div>
</section>
