<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, ScrollTrigger } from '#lib/motion/gsap.ts';
	import { prefersReducedMotion } from '#lib/motion/tokens.ts';

	let { words = ['Jeux', 'Voix', 'Images', 'Récits', 'Mondes'] }: { words?: string[] } = $props();

	let root: HTMLElement;
	let track: HTMLElement;

	onMount(() => {
		if (prefersReducedMotion()) return;
		const ctx = gsap.context(() => {
			const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
			const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3.out' });
			let dir = 1;

			// Velocity marquee: speed and skew follow scroll velocity (motion report §7).
			ScrollTrigger.create({
				trigger: root,
				start: 'top bottom',
				end: 'bottom top',
				onUpdate: (self) => {
					const v = self.getVelocity();
					dir = self.direction;
					const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(v) / 400);
					gsap.to(loop, {
						timeScale: boost * dir,
						duration: 0.2,
						overwrite: true,
						onComplete: () => {
							gsap.to(loop, { timeScale: dir, duration: 1.2, ease: 'power2.out' });
						}
					});
					skewTo(gsap.utils.clamp(-10, 10, v / -300));
				}
			});
		}, root);
		return () => ctx.revert();
	});
</script>

<div
	bind:this={root}
	class="relative overflow-clip border-y border-smoke py-6 md:py-10"
	aria-hidden="true"
>
	<div bind:this={track} class="flex w-max will-change-transform">
		{#each [0, 1] as copy (copy)}
			<div class="flex shrink-0 items-center">
				{#each words as w, i (w + copy)}
					<span
						class="px-6 font-display text-display whitespace-nowrap md:px-10"
						class:italic={i % 2 === 1}>{w}</span
					>
					<span class="text-h2 text-ember">✦</span>
				{/each}
			</div>
		{/each}
	</div>
</div>
