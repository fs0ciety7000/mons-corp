<script lang="ts">
	import { onMount } from 'svelte';
	import { core } from '#lib/state/core.svelte.ts';
	import { gsap } from '#lib/motion/gsap.ts';
	import { ease, prefersReducedMotion } from '#lib/motion/tokens.ts';
	import Logo from '#lib/components/brand/Logo.svelte';
	import { isHolding, site } from '#lib/sites/config.ts';

	let root = $state<HTMLElement>();
	let count = $state(0);
	let done = $state(false);
	const display = $derived(String(Math.round(count)).padStart(3, '0'));

	onMount(() => {
		const reduce = prefersReducedMotion();
		let visited = false;
		try {
			visited = sessionStorage.getItem(`cardor:visited:${site.id}`) === '1';
			sessionStorage.setItem(`cardor:visited:${site.id}`, '1');
		} catch {
			/* storage unavailable: play the full intro */
		}

		const counter = { v: 0 };
		const ctx = gsap.context(() => {
			if (reduce) {
				gsap.to(root!, {
					autoAlpha: 0,
					duration: 0.3,
					delay: 0.1,
					onStart: () => (core.ready = true),
					onComplete: () => (done = true)
				});
				return;
			}

			const total = visited ? 0.6 : 1.6;
			const tl = gsap.timeline({ paused: true });
			tl.to(counter, {
				v: 100,
				duration: total,
				ease: ease.snap,
				onUpdate: () => (count = counter.v)
			})
				.to('[data-pre-bar]', { scaleX: 1, duration: total, ease: ease.snap }, 0)
				// Division sites: the emblem is revealed bottom-up with the counter
				// (stepped like a loading bar for Interactive).
				.fromTo(
					'[data-pre-emblem]',
					{ clipPath: 'inset(100% 0% 0% 0%)', scale: 0.92 },
					{
						clipPath: 'inset(0% 0% 0% 0%)',
						scale: 1,
						duration: total,
						ease: site.id === 'interactive' ? 'steps(12)' : ease.snap
					},
					0
				)
				// Holding: the Car d'Or wheel turns with the counter, then its Ember core ignites.
				.fromTo(
					'[data-pre-wheel]',
					{ rotation: -540, scale: 0.85 },
					{ rotation: 0, scale: 1, duration: total, ease: ease.snap },
					0
				)
				.fromTo(
					'[data-pre-core]',
					{ scale: 0 },
					{ scale: 1, duration: 0.6, ease: ease.elastic },
					total - 0.15
				)
				.to('[data-pre-inner]', { yPercent: -30, autoAlpha: 0, duration: 0.6, ease: ease.in })
				.add(() => {
					core.ready = true;
				}, '-=0.2')
				.to(root!, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.0, ease: ease.inOut }, '-=0.3')
				.add(() => (done = true));

			// Wait for fonts so the wordmark split measures real glyphs.
			Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]).then(() =>
				tl.play()
			);
		}, root);

		return () => ctx.revert();
	});
</script>

{#if !done}
	<div
		bind:this={root}
		class="preloader fixed inset-0 z-[100] flex flex-col justify-between bg-void p-4 md:p-8"
		style="clip-path: inset(0% 0% 0% 0%)"
		role="status"
		aria-live="polite"
		aria-label="Chargement"
	>
		<div data-pre-inner class="flex items-start justify-between">
			<span class="label text-ash">{site.name}</span>
			<span class="label text-ash">{site.preloader}</span>
		</div>
		<div
			data-pre-inner
			class="pointer-events-none absolute top-1/2 left-1/2 size-[clamp(9rem,26vw,20rem)] -translate-x-1/2 -translate-y-1/2"
			aria-hidden="true"
		>
			{#if isHolding}
				<div data-pre-wheel class="relative size-full" style="--logo-t3: transparent">
					<Logo name="cardor-monogram" class="size-full" />
				</div>
				<span
					data-pre-core
					class="absolute top-1/2 left-1/2 -mt-[2.4%] -ml-[2.4%] block size-[4.8%] scale-0 rounded-full bg-signal"
				></span>
			{:else}
				<div data-pre-emblem class="size-full">
					<Logo name={site.emblem} class="size-full" />
				</div>
			{/if}
		</div>
		<div data-pre-inner class="flex items-end justify-between gap-6">
			<span class="font-display text-[clamp(5rem,18vw,16rem)] leading-[0.8] tabular-nums"
				>{display}</span
			>
			<span class="mb-3 label text-signal">●&nbsp;REC</span>
		</div>
		<span
			data-pre-bar
			class="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-signal"
			aria-hidden="true"
		></span>
	</div>
{/if}

<noscript>
	<style>
		.preloader {
			display: none !important;
		}
		[data-hero] {
			visibility: visible !important;
		}
	</style>
</noscript>
