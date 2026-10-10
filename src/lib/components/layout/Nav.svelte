<script lang="ts">
	import { onMount } from 'svelte';
	import ParisClock from './ParisClock.svelte';
	import { nav } from '#lib/data/site.ts';
	import { core } from '#lib/state/core.svelte.ts';
	import { gsap, ScrollTrigger } from '#lib/motion/gsap.ts';
	import { ease, prefersReducedMotion } from '#lib/motion/tokens.ts';

	let root: HTMLElement;
	let introPlayed = false;

	onMount(() => {
		const ctx = gsap.context(() => {
			gsap.set(root, { autoAlpha: 0 });
			// Hide on scroll down, reveal on scroll up.
			ScrollTrigger.create({
				start: 'top -120',
				end: 'max',
				onUpdate: (self) => {
					if (!introPlayed) return;
					gsap.to(root, {
						yPercent: self.direction === 1 ? -110 : 0,
						duration: 0.6,
						ease: ease.out,
						overwrite: 'auto'
					});
				}
			});
		}, root);
		return () => ctx.revert();
	});

	$effect(() => {
		if (!core.ready || introPlayed) return;
		introPlayed = true;
		const reduce = prefersReducedMotion();
		gsap.set(root, { autoAlpha: 1 });
		if (reduce) return;
		gsap.from(root.querySelectorAll('[data-nav-item]'), {
			yPercent: -120,
			duration: 0.9,
			ease: ease.out,
			stagger: 0.06,
			delay: 1.6
		});
	});
</script>

<header
	bind:this={root}
	class="invisible fixed inset-x-0 top-0 z-50 text-bone mix-blend-difference"
>
	<nav class="flex items-center justify-between gutter-x py-5 md:py-6" aria-label="Principale">
		<div class="overflow-clip">
			<a
				href="/"
				data-nav-item
				class="flex items-baseline gap-1.5 font-display text-2xl leading-none md:text-3xl"
				aria-label="CARDOR Media — accueil"
			>
				CARDOR<span class="italic">Media</span>
			</a>
		</div>

		<div class="flex items-center gap-6 md:gap-10">
			<div class="hidden overflow-clip md:block">
				<span data-nav-item class="block"><ParisClock /></span>
			</div>
			<ul class="flex items-center gap-5 md:gap-8">
				{#each nav as item, i (item.href)}
					<li class={['overflow-clip', i < nav.length - 1 && 'max-md:hidden']}>
						<a href={item.href} data-nav-item class="nav-link relative block py-1 label"
							>{item.label}</a
						>
					</li>
				{/each}
			</ul>
		</div>
	</nav>
</header>

<style>
	.nav-link::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 1px;
		background: currentColor;
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.6s var(--ease-cardor-out);
	}
	.nav-link:hover::after,
	.nav-link:focus-visible::after {
		transform: scaleX(1);
		transform-origin: left;
	}
</style>
