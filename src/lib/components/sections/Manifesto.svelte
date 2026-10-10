<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, SplitText } from '#lib/motion/gsap.ts';
	import { isTouch, prefersReducedMotion } from '#lib/motion/tokens.ts';
	import { reveal } from '#lib/motion/actions.ts';

	let root: HTMLElement;
	let statement: HTMLElement;

	const pillars = [
		{
			k: '3',
			label: 'Studios',
			text: 'Interactive, Soundworks, Creative Lab. Une seule direction.'
		},
		{ k: '1', label: 'Noyau', text: 'Une maison commune, des pipelines partagés, zéro silo.' },
		{ k: '∞', label: 'Mondes', text: 'Du premier croquis au dernier mixage, tout naît ici.' }
	];

	onMount(() => {
		// Scroll-scrubbed illumination is a desktop nicety; touch devices get the full text.
		if (prefersReducedMotion() || isTouch()) return;
		const ctx = gsap.context(() => {
			const words = SplitText.create(statement, { type: 'words' }).words;
			// Scroll-scrubbed word illumination (motion report §7).
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

<section
	id="manifeste"
	bind:this={root}
	class="relative section-y"
	aria-labelledby="manifeste-title"
>
	<div class="grid-cardor gap-y-12">
		<p class="col-span-4 label text-ash md:col-span-2 lg:col-span-3" use:reveal>[01] — Manifeste</p>
		<h2 id="manifeste-title" class="sr-only">Manifeste</h2>
		<p bind:this={statement} class="col-span-4 font-display text-h1 md:col-span-8 lg:col-span-9">
			Nous ne vendons pas des prestations. Nous <em class="text-ember">fabriquons des mondes</em> —
			ceux que l’on joue, ceux que l’on entend, ceux que l’on raconte. Chaque studio maîtrise son
			art ; ensemble, ils donnent aux œuvres une <em>âme cohérente</em>, de la première ligne de
			lore au dernier sample.
		</p>
	</div>

	<div class="grid-cardor mt-24 gap-y-10 md:mt-32">
		{#each pillars as p, i (p.label)}
			<div class="col-span-4 border-t border-smoke pt-6 md:col-span-8 lg:col-span-4">
				<div class="flex items-baseline justify-between">
					<span class="label text-ash" use:reveal={{ type: 'block', delay: i * 0.1 }}
						>0{i + 1} / {p.label}</span
					>
					<span
						class="font-display text-display leading-none"
						use:reveal={{ type: 'chars', delay: i * 0.1 }}>{p.k}</span
					>
				</div>
				<p class="mt-6 max-w-[36ch] text-ash" use:reveal={{ delay: 0.15 + i * 0.1 }}>{p.text}</p>
			</div>
		{/each}
	</div>
</section>
