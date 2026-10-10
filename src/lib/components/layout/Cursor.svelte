<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from '#lib/motion/gsap.ts';
	import { ease, isFinePointer, prefersReducedMotion } from '#lib/motion/tokens.ts';

	let dot: HTMLElement;
	let enabled = $state(false);
	let label = $state('');
	let hovering = $state(false);

	onMount(() => {
		if (!isFinePointer() || prefersReducedMotion()) return;
		enabled = true;
		document.documentElement.classList.add('has-cursor');

		const xTo = gsap.quickTo(dot, 'x', { duration: 0.35, ease: 'power3.out' });
		const yTo = gsap.quickTo(dot, 'y', { duration: 0.35, ease: 'power3.out' });
		gsap.set(dot, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

		const move = (e: PointerEvent) => {
			gsap.to(dot, { autoAlpha: 1, duration: 0.3, overwrite: 'auto' });
			xTo(e.clientX);
			yTo(e.clientY);
		};
		const over = (e: PointerEvent) => {
			const el = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button');
			hovering = !!el;
			label = el?.dataset.cursor ?? '';
		};
		const down = () => gsap.to(dot, { scale: 0.75, duration: 0.2, ease: ease.out });
		const up = () => gsap.to(dot, { scale: 1, duration: 0.8, ease: ease.elastic });
		const hide = () => gsap.to(dot, { autoAlpha: 0, duration: 0.3 });

		window.addEventListener('pointermove', move, { passive: true });
		document.addEventListener('pointerover', over);
		window.addEventListener('pointerdown', down);
		window.addEventListener('pointerup', up);
		document.documentElement.addEventListener('pointerleave', hide);

		return () => {
			document.documentElement.classList.remove('has-cursor');
			window.removeEventListener('pointermove', move);
			document.removeEventListener('pointerover', over);
			window.removeEventListener('pointerdown', down);
			window.removeEventListener('pointerup', up);
			document.documentElement.removeEventListener('pointerleave', hide);
			gsap.killTweensOf(dot);
		};
	});
</script>

<div
	bind:this={dot}
	class="cursor pointer-events-none fixed top-0 left-0 z-[95] mix-blend-difference"
	class:hidden={!enabled}
	class:is-hover={hovering}
	class:has-label={!!label}
	aria-hidden="true"
>
	<span class="ring"></span>
	<span class="text label text-void">{label}</span>
</div>

<style>
	.cursor {
		width: 64px;
		height: 64px;
		display: grid;
		place-items: center;
	}
	.ring {
		grid-area: 1 / 1;
		width: 100%;
		height: 100%;
		border-radius: 999px;
		background: var(--color-bone);
		transform: scale(0.125);
		transition: transform 0.6s var(--ease-cardor-out);
	}
	.text {
		grid-area: 1 / 1;
		position: relative;
		z-index: 1;
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 0.3s,
			transform 0.5s var(--ease-cardor-out);
		color: var(--color-void);
	}
	.is-hover .ring {
		transform: scale(0.5);
	}
	.has-label .ring {
		transform: scale(1);
	}
	.has-label .text {
		opacity: 1;
		transform: none;
	}
</style>
