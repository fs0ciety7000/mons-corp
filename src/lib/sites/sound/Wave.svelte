<script lang="ts">
	import { onMount } from 'svelte';
	import { core } from '#lib/state/core.svelte.ts';
	import { gsap } from '#lib/motion/gsap.ts';
	import { prefersReducedMotion } from '#lib/motion/tokens.ts';

	// OCC Soundworks signature: a waveform crossing the page, amplified by the drone.
	let path: SVGPathElement;
	const W = 1200;
	const N = 160;

	function draw(t: number) {
		const amp = 10 + core.audio * 70;
		let d = '';
		for (let i = 0; i <= N; i++) {
			const x = (i / N) * W;
			const env = Math.sin((i / N) * Math.PI);
			const y =
				50 +
				env *
					amp *
					(Math.sin(i * 0.18 + t * 2.1) * 0.6 +
						Math.sin(i * 0.47 - t * 3.3) * 0.3 +
						Math.sin(i * 0.05 + t * 0.7) * 0.4);
			d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
		}
		path.setAttribute('d', d);
	}

	onMount(() => {
		draw(0);
		if (prefersReducedMotion()) return;
		const tick = (time: number) => draw(time);
		gsap.ticker.add(tick);
		return () => gsap.ticker.remove(tick);
	});
</script>

<svg
	class="pointer-events-none w-full text-signal"
	viewBox="0 0 {W} 100"
	preserveAspectRatio="none"
	aria-hidden="true"
>
	<path
		bind:this={path}
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		vector-effect="non-scaling-stroke"
		opacity="0.8"
	/>
</svg>
