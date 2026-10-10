<script lang="ts">
	import { onMount } from 'svelte';
	import type { Title } from './types.ts';
	import { SITE } from '#lib/sites/config.ts';
	import { reveal, scramble } from '#lib/motion/actions.ts';
	import { gsap } from '#lib/motion/gsap.ts';
	import { onFirstView, prefersReducedMotion } from '#lib/motion/tokens.ts';

	let { index, label, title, id }: { index: string; label: string; title: Title; id?: string } =
		$props();

	let stroke = $state<SVGPathElement>();

	// Creative Lab: the heading underline is drawn like a pen stroke.
	onMount(() => {
		if (SITE !== 'creative' || !stroke || prefersReducedMotion()) return;
		const len = stroke.getTotalLength();
		const tw = gsap.fromTo(
			stroke,
			{ strokeDasharray: len, strokeDashoffset: len },
			{
				strokeDashoffset: 0,
				duration: 1.4,
				ease: 'cardor.inOut',
				paused: true
			}
		);
		const stop = onFirstView(stroke, () => tw.play());
		return () => {
			stop();
			tw.kill();
		};
	});
</script>

<div class="grid-cardor gap-y-8">
	<p class="col-span-4 label text-ash md:col-span-2 lg:col-span-3" use:reveal>
		[{index}] — {label}
	</p>
	<div class="col-span-4 md:col-span-8 lg:col-span-9">
		{#if SITE === 'interactive'}
			<h2 {id} class="font-display text-display">
				<span use:scramble>{title.before}</span>
				<em class="text-signal" use:scramble={{ duration: 1 }}>{title.em}</em>
				{#if title.after}<span use:scramble>{title.after}</span>{/if}
			</h2>
		{:else}
			<h2 {id} class="font-display text-display" use:reveal={{ type: 'words' }}>
				{title.before} <em class="text-signal">{title.em}</em>
				{title.after ?? ''}
			</h2>
		{/if}
		{#if SITE === 'creative'}
			<svg class="mt-4 h-5 w-[min(28rem,70%)] text-signal" viewBox="0 0 400 20" aria-hidden="true">
				<path
					bind:this={stroke}
					d="M2 13 C 60 4, 120 18, 190 10 S 320 3, 398 9"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
				/>
			</svg>
		{/if}
	</div>
</div>
