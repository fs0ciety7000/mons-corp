<script lang="ts">
	import { onMount } from 'svelte';
	import SectionHead from './SectionHead.svelte';
	import type { DivisionContent } from './types.ts';
	import { gsap } from '#lib/motion/gsap.ts';
	import { prefersReducedMotion } from '#lib/motion/tokens.ts';
	import { reveal } from '#lib/motion/actions.ts';

	let { method, index }: { method: DivisionContent['method']; index: string } = $props();

	let root: HTMLElement;

	// The rail fills as the steps scroll past: progress is literal.
	onMount(() => {
		if (prefersReducedMotion()) return;
		const ctx = gsap.context(() => {
			gsap.fromTo(
				'[data-method-rail]',
				{ scaleX: 0 },
				{
					scaleX: 1,
					ease: 'none',
					scrollTrigger: {
						trigger: '[data-method-list]',
						start: 'top 80%',
						end: 'bottom 60%',
						scrub: 0.6
					}
				}
			);
		}, root);
		return () => ctx.revert();
	});
</script>

<section
	bind:this={root}
	id={method.id}
	class="relative section-y"
	aria-labelledby="{method.id}-title"
>
	<SectionHead {index} label={method.label} title={method.title} id="{method.id}-title" />
	<div class="relative mt-16 gutter-x md:mt-24">
		<div class="relative h-px bg-smoke" aria-hidden="true">
			<span data-method-rail class="absolute inset-0 origin-left bg-signal"></span>
		</div>
	</div>
	<ol data-method-list class="grid-cardor mt-10 gap-y-12">
		{#each method.steps as step, i (step.name)}
			<li
				class="col-span-4 md:col-span-4 lg:col-span-3"
				use:reveal={{ type: 'block', delay: i * 0.1 }}
			>
				<span class="font-display text-display leading-none text-signal">0{i + 1}</span>
				<h3 class="mt-4 font-display text-h2">{step.name}</h3>
				<p class="mt-3 max-w-[32ch] text-ash">{step.text}</p>
			</li>
		{/each}
	</ol>
</section>
