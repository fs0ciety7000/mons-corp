<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from '#lib/motion/gsap.ts';
	import { isFinePointer, prefersReducedMotion } from '#lib/motion/tokens.ts';

	/**
	 * CM Creative Lab signature: the cursor leaves a fading amber ink stroke.
	 * Width follows speed like a brush (slow = wide). Rendered on gsap.ticker (ADR-004).
	 */
	let canvas: HTMLCanvasElement;

	onMount(() => {
		if (!isFinePointer() || prefersReducedMotion()) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const colour =
			getComputedStyle(document.documentElement).getPropertyValue('--color-signal').trim() ||
			'#FFB547';

		const resize = () => {
			canvas.width = innerWidth * dpr;
			canvas.height = innerHeight * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		resize();

		let last: { x: number; y: number; w: number } | null = null;
		const queue: { x: number; y: number }[] = [];
		let lastMove = 0;
		let dirty = false;
		const move = (e: PointerEvent) => {
			queue.push({ x: e.clientX, y: e.clientY });
			lastMove = performance.now();
		};
		const leave = () => (last = null);

		const tick = () => {
			// 8-bit alpha never fades to zero with destination-out: wipe once idle.
			if (performance.now() - lastMove > 1500) {
				if (dirty) ctx.clearRect(0, 0, innerWidth, innerHeight);
				dirty = false;
				return;
			}
			dirty = true;
			// Fade previous strokes.
			ctx.globalCompositeOperation = 'destination-out';
			ctx.fillStyle = 'rgba(0,0,0,0.045)';
			ctx.fillRect(0, 0, innerWidth, innerHeight);
			ctx.globalCompositeOperation = 'source-over';
			ctx.strokeStyle = colour;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			for (const p of queue.splice(0)) {
				if (last) {
					const dist = Math.hypot(p.x - last.x, p.y - last.y);
					const w = last.w + (Math.max(1.2, 9 - dist * 0.18) - last.w) * 0.35;
					ctx.globalAlpha = 0.55;
					ctx.lineWidth = w;
					ctx.beginPath();
					ctx.moveTo(last.x, last.y);
					ctx.quadraticCurveTo(last.x, last.y, (last.x + p.x) / 2, (last.y + p.y) / 2);
					ctx.lineTo(p.x, p.y);
					ctx.stroke();
					last = { ...p, w };
				} else {
					last = { ...p, w: 4 };
				}
			}
			ctx.globalAlpha = 1;
		};

		window.addEventListener('pointermove', move, { passive: true });
		document.documentElement.addEventListener('pointerleave', leave);
		window.addEventListener('resize', resize);
		gsap.ticker.add(tick);
		return () => {
			gsap.ticker.remove(tick);
			window.removeEventListener('pointermove', move);
			document.documentElement.removeEventListener('pointerleave', leave);
			window.removeEventListener('resize', resize);
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="pointer-events-none fixed inset-0 z-[70] size-full mix-blend-screen"
	aria-hidden="true"
></canvas>
