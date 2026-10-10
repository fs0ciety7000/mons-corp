<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, SplitText } from '#lib/motion/gsap.ts';
	import { isTouch, prefersReducedMotion } from '#lib/motion/tokens.ts';
	import { reveal } from '#lib/motion/actions.ts';

	let { index, label, html }: { index: string; label: string; html: string } = $props();

	let root: HTMLElement;
	let statement: HTMLElement;

	// Scroll-scrubbed word illumination (motion report §7), shared with the holding.
	onMount(() => {
		// Scroll-scrubbed illumination is a desktop nicety; touch devices get the full text.
		if (prefersReducedMotion() || isTouch()) return;
		const ctx = gsap.context(() => {
			const words = SplitText.create(statement, { type: 'words' }).words;
			gsap.fromTo(
				words,
				{ opacity: 0.16 },
				{
					opacity: 1,
					ease: 'none',
					stagger: 0.1,
					scrollTrigger: { trigger: statement, start: 'top 75%', end: 'bottom 40%', scrub: 1 }
				}
			);
		}, root);
		return () => ctx.revert();
	});
</script>

<section bind:this={root} id="manifeste" class="relative section-y" aria-label={label}>
	<div class="grid-cardor gap-y-12">
		<p class="col-span-4 label text-ash md:col-span-2 lg:col-span-3" use:reveal>
			[{index}] — {label}
		</p>
		<p
			bind:this={statement}
			class="statement col-span-4 font-display text-h1 md:col-span-8 lg:col-span-9"
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- static, trusted copy -->
			{@html html}
		</p>
	</div>
</section>

<style>
	.statement :global(em) {
		color: var(--color-signal);
	}
</style>
