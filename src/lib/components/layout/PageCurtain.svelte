<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { gsap, ScrollTrigger } from '#lib/motion/gsap.ts';
	import { ease, prefersReducedMotion } from '#lib/motion/tokens.ts';
	import { scrollToTop } from '#lib/motion/lenis.ts';
	import { site } from '#lib/sites/config.ts';
	import Logo from '#lib/components/brand/Logo.svelte';

	let curtain: HTMLElement;

	// Page transitions — motion report §6.
	onNavigate((navigation) => {
		const from = navigation.from?.url.pathname;
		const to = navigation.to?.url.pathname;
		if (!to || from === to || prefersReducedMotion()) return;

		return new Promise<void>((resolve) => {
			gsap
				.timeline()
				.set(curtain, { visibility: 'visible' })
				.fromTo(
					curtain,
					{ clipPath: 'inset(100% 0% 0% 0%)' },
					{ clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: ease.inOut }
				)
				.fromTo(
					'[data-curtain-wheel]',
					{ rotation: -180, scale: 0.6 },
					{ rotation: 0, scale: 1, duration: 0.9, ease: ease.out },
					0.1
				)
				.fromTo(
					'[data-curtain-label]',
					{ yPercent: 100 },
					{ yPercent: 0, duration: 0.5, ease: ease.out },
					0.25
				)
				.add(() => {
					resolve();
					navigation.complete.then(() => {
						scrollToTop();
						ScrollTrigger.refresh();
						gsap
							.timeline()
							.to('[data-curtain-label]', { yPercent: -100, duration: 0.4, ease: ease.in })
							.to(
								curtain,
								{ clipPath: 'inset(0% 0% 100% 0%)', duration: 0.7, ease: ease.inOut },
								0.1
							)
							.set(curtain, { visibility: 'hidden' });
					});
				});
		});
	});
</script>

<div
	bind:this={curtain}
	class="invisible fixed inset-0 z-[80] grid place-items-center bg-signal text-void"
	aria-hidden="true"
>
	<div class="flex items-center gap-5">
		<span data-curtain-wheel class="block size-[clamp(3rem,6vw,5.5rem)]">
			<Logo name={site.emblem} variant="mono" class="size-full" />
		</span>
		<span class="overflow-clip">
			<span data-curtain-label class="block font-display text-h1 italic"
				>{site.id === 'holding' ? 'CARDOR' : site.short}</span
			>
		</span>
	</div>
</div>
