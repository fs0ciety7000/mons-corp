<script lang="ts">
	import { onMount } from 'svelte';
	import CoreCanvas from './CoreCanvas.svelte';
	import Logo from '#lib/components/brand/Logo.svelte';
	import { divisions, type DivisionId } from '#lib/data/divisions.ts';
	import { core, setCoreState } from '#lib/state/core.svelte.ts';
	import { gsap, SplitText } from '#lib/motion/gsap.ts';
	import { duration, ease, prefersReducedMotion, stagger } from '#lib/motion/tokens.ts';

	let root = $state<HTMLElement>();
	let wordmark: HTMLElement;
	let timeline: gsap.core.Timeline | null = null;

	const enter = (id: DivisionId) => setCoreState(id);
	const leave = () => setCoreState('holding');

	onMount(() => {
		const reduce = prefersReducedMotion();
		const ctx = gsap.context(() => {
			if (reduce) {
				timeline = gsap
					.timeline({ paused: true })
					.fromTo('[data-hero]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
				return;
			}

			const chars = SplitText.create(wordmark, { type: 'chars', mask: 'chars' }).chars;
			const metas = SplitText.create('[data-hero-meta]', { type: 'lines', mask: 'lines' }).lines;
			const lead = SplitText.create('[data-hero-lead]', { type: 'lines', mask: 'lines' }).lines;

			gsap.set('[data-hero]', { autoAlpha: 1 });

			// Master intro — motion report §5 (t relative to curtain lift at 1.60 s).
			timeline = gsap
				.timeline({ paused: true, defaults: { ease: ease.out } })
				.from(
					chars,
					{
						yPercent: 112,
						rotate: 8,
						transformOrigin: '0% 100%',
						duration: duration.lg,
						stagger: stagger.chars * 2
					},
					0.5
				)
				.fromTo(
					'[data-hero-italic]',
					{ clipPath: 'inset(0 100% 0 0)', xPercent: -6 },
					{ clipPath: 'inset(0 0% 0 0)', xPercent: 0, duration: 1.0, ease: ease.inOut },
					0.85
				)
				.from(metas, { yPercent: 100, duration: duration.md, stagger: stagger.words }, 1.1)
				.from(lead, { yPercent: 100, duration: duration.lg, stagger: stagger.lines }, 1.2)
				.from(
					'[data-hero-rule]',
					{ scaleX: 0, transformOrigin: '0% 50%', duration: duration.lg, stagger: stagger.cards },
					1.3
				)
				.from(
					'[data-hero-row] > :not(.row-emblem)',
					{ yPercent: 110, duration: duration.md, stagger: 0.04 },
					1.45
				)
				// .row-emblem stays out of the intro: its CSS transitions own transform/opacity (Motion review).
				.from('[data-hero-scroll]', { autoAlpha: 0, y: 12, duration: duration.md }, 1.8);
		}, root);

		return () => ctx.revert();
	});

	$effect(() => {
		if (core.ready) timeline?.play();
	});
</script>

<section
	bind:this={root}
	class="relative flex h-svh min-h-[640px] flex-col overflow-clip select-none"
	aria-labelledby="hero-title"
>
	<CoreCanvas trigger={root} />

	<!-- Legibility veil (design report §8: text on WebGL) -->
	<div class="pointer-events-none absolute inset-0 hero-scrim" aria-hidden="true"></div>

	<div data-hero class="invisible relative z-10 flex flex-1 flex-col pt-24 md:pt-28">
		<!-- Meta row -->
		<div class="flex items-start justify-between gap-6 gutter-x text-ash">
			<p data-hero-meta class="max-w-[22ch] label">[CM—2026] Holding de divertissement</p>
			<p data-hero-meta class="hidden text-right label md:block">
				Mons, Belgique — 50.4542° N, 3.9523° E
			</p>
		</div>

		<!-- Wordmark -->
		<div class="relative mt-auto mb-auto gutter-x pt-10 md:pt-0">
			<h1 id="hero-title" class="relative font-display leading-[0.8] tracking-[-0.035em]">
				<span
					bind:this={wordmark}
					class="block text-[clamp(4.75rem,24.5vw,36rem)] whitespace-nowrap">CARDOR</span
				>
				<span
					data-hero-italic
					class="absolute right-[4vw] -bottom-[0.1em] block text-[clamp(2.5rem,9vw,13rem)] text-ember italic md:right-[6vw]"
					>Media</span
				>
			</h1>
		</div>

		<!-- Bottom band -->
		<div class="grid-cardor items-end gap-y-10 pb-8 md:pb-10">
			<div class="col-span-4 flex flex-col gap-8 md:col-span-4 lg:col-span-4">
				<div data-hero-scroll class="hidden items-center gap-3 text-ash lg:flex" aria-hidden="true">
					<span class="scroll-line relative block h-10 w-px overflow-hidden bg-smoke"></span>
					<span class="label">Défiler</span>
				</div>
				<p data-hero-lead class="max-w-[34ch] text-lead text-bone/90">
					Nous fabriquons des mondes. Jeux, voix, images, récits — trois studios, un seul noyau
					créatif.
				</p>
			</div>

			<ul class="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7" aria-label="Nos divisions">
				{#each divisions as d (d.id)}
					<li class="relative">
						<span data-hero-rule class="absolute inset-x-0 top-0 h-px bg-smoke" aria-hidden="true"
						></span>
						<a
							href={d.url}
							class="division-row group flex items-baseline gap-4 overflow-clip py-3 md:gap-6"
							style:--division={d.color}
							data-cursor={d.cursorLabel}
							data-hero-row
							onpointerenter={() => enter(d.id)}
							onpointerleave={leave}
							onfocus={() => enter(d.id)}
							onblur={leave}
						>
							<span class="w-8 label text-ash transition-colors group-hover:text-(--division)"
								>{d.index}</span
							>
							<span
								class="row-emblem relative size-9 shrink-0 self-center text-ash group-hover:text-(--division) md:size-11"
							>
								<Logo
									name={d.id}
									swap
									animate="hover"
									host=".division-row"
									class="absolute inset-0 size-full"
								/>
							</span>
							<span class="swap relative flex-1 font-display text-h2 whitespace-nowrap">
								<span class="swap-a block">{d.name}</span>
								<span
									class="swap-b absolute inset-0 block text-(--division) italic"
									aria-hidden="true">{d.name}</span
								>
							</span>
							<span class="hidden label text-ash xl:block">{d.host}</span>
							<svg
								class="size-4 shrink-0 self-center text-ash transition-transform duration-500 ease-(--ease-cardor-out) group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-(--division)"
								viewBox="0 0 16 16"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" /></svg
							>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<style>
	.swap-a,
	.swap-b {
		transition: transform 0.7s var(--ease-cardor-out);
	}
	.swap-b {
		transform: translateY(105%);
	}
	.division-row:hover .swap-a,
	.division-row:focus-visible .swap-a {
		transform: translateY(-105%);
	}
	.division-row:hover .swap-b,
	.division-row:focus-visible .swap-b {
		transform: translateY(0);
	}
	.row-emblem {
		opacity: 0.4;
		transform: scale(0.82) rotate(-6deg);
		transition:
			opacity 0.5s var(--ease-cardor-out),
			transform 0.8s var(--ease-cardor-out),
			color 0.4s;
	}
	.division-row:hover .row-emblem,
	.division-row:focus-visible .row-emblem {
		opacity: 1;
		transform: none;
	}
	.swap {
		overflow: clip;
		line-height: 1.05;
	}

	.scroll-line::after {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--color-bone);
		transform-origin: top;
		animation: scroll-line 2.2s var(--ease-cardor-in-out) infinite;
	}
	@keyframes scroll-line {
		0% {
			transform: scaleY(0);
			transform-origin: top;
		}
		45% {
			transform: scaleY(1);
			transform-origin: top;
		}
		55% {
			transform: scaleY(1);
			transform-origin: bottom;
		}
		100% {
			transform: scaleY(0);
			transform-origin: bottom;
		}
	}
</style>
