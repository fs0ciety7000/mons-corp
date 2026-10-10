<script lang="ts">
	import { onMount } from 'svelte';
	import Logo from '#lib/components/brand/Logo.svelte';
	import { emblems, type LogoName } from '#lib/data/logos.ts';
	import { gsap } from '#lib/motion/gsap.ts';
	import { ease, onFirstView, prefersReducedMotion } from '#lib/motion/tokens.ts';
	import { reveal } from '#lib/motion/actions.ts';

	const order: LogoName[] = ['cardor-emblem', 'interactive', 'sound', 'creative'];
	const accents: Record<string, string> = {
		'cardor-emblem': 'var(--color-or)',
		interactive: 'var(--color-interactive)',
		sound: 'var(--color-sound)',
		creative: 'var(--color-creative)'
	};

	let root: HTMLElement;
	let track: HTMLElement;

	onMount(() => {
		if (prefersReducedMotion()) return;
		const stops: Array<() => void> = [];
		const ctx = gsap.context(() => {
			// Each emblem is revealed through a circular mask, like a spotlight on the procession.
			gsap.utils.toArray<HTMLElement>('[data-cortege-emblem]').forEach((el, i) => {
				const tw = gsap.fromTo(
					el,
					{ clipPath: 'circle(0% at 50% 60%)', yPercent: 12 },
					{
						clipPath: 'circle(75% at 50% 60%)',
						yPercent: 0,
						duration: 1.4,
						ease: ease.out,
						delay: (i % 4) * 0.08,
						paused: true
					}
				);
				stops.push(onFirstView(el, () => tw.play()));
			});

			// The procession advances: the row drifts sideways as the section scrolls by.
			gsap.matchMedia().add('(min-width: 80rem)', () => {
				gsap.fromTo(
					track,
					{ xPercent: 6 },
					{
						xPercent: -6,
						ease: 'none',
						scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
					}
				);
			});
		}, root);
		return () => {
			stops.forEach((fn) => fn());
			ctx.revert();
		};
	});
</script>

<section
	id="cortege"
	bind:this={root}
	class="relative overflow-clip section-y"
	aria-labelledby="cortege-title"
>
	<div class="grid-cardor gap-y-8">
		<p class="col-span-4 label text-ash md:col-span-2 lg:col-span-3" use:reveal>[03] — Héritage</p>
		<div class="col-span-4 md:col-span-8 lg:col-span-9">
			<h2 id="cortege-title" class="font-display text-display" use:reveal={{ type: 'chars' }}>
				Nés à Mons, <em class="text-or">sous le signe</em> du Doudou.
			</h2>
			<p class="mt-8 max-w-[56ch] text-lead text-ash" use:reveal={{ delay: 0.2 }}>
				CARDOR, c’est le Car d’Or : le carrosse doré qui porte chaque année la châsse de sainte
				Waudru. Nos quatre emblèmes viennent du même cortège : le carrosse, le dragon, le beffroi et
				le singe du Grand-Garde.
			</p>
		</div>
	</div>

	<ul bind:this={track} class="grid-cardor mt-20 gap-y-16 md:mt-28">
		{#each order as name, i (name)}
			<li class="col-span-4 lg:col-span-3" style:--accent={accents[name]}>
				<div data-cortege-emblem class="relative aspect-square border border-smoke bg-ink">
					<div class="absolute inset-[12%]">
						<Logo {name} animate="hover" drawIn host="li" class="size-full" />
					</div>
				</div>
				<p class="mt-6 label text-(--accent)">0{i + 1} — {emblems[name].entity}</p>
				<h3 class="mt-3 font-display text-h2">{emblems[name].motif}</h3>
				<p class="mt-3 max-w-[36ch] text-sm text-ash">{emblems[name].meaning}</p>
			</li>
		{/each}
	</ul>

	<div class="mt-16 gutter-x">
		<a href="/marque" class="cortege-link label text-bone" data-cursor="Voir">
			Charte &amp; sketchboard technique →
		</a>
	</div>
</section>

<style>
	.cortege-link {
		background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat;
		padding-bottom: 4px;
		transition: background-size 0.6s var(--ease-cardor-out);
	}
	.cortege-link:hover,
	.cortege-link:focus-visible {
		background-size: 100% 1px;
	}
</style>
