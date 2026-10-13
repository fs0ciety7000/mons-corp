import type { Action } from 'svelte/action';
import { gsap } from '#lib/motion/gsap.ts';
import { duration, onFirstView, prefersReducedMotion } from '#lib/motion/tokens.ts';

/**
 * use:crisp — snaps an element to whole device pixels. The fluid grid (fr columns, clamp()
 * type) can leave a container at x = 431.5 px; pixel text drawn from there would be resampled
 * and blurred. The fractional part is cancelled with `translate`, recomputed whenever the page
 * reflows (ResizeObserver on <body>, no animation loop). Browser-only by construction (actions
 * run on mount).
 */
export const crisp: Action<HTMLElement> = (node) => {
	const frac = (v: number) => ((v % 1) + 1) % 1;
	const fix = () => {
		node.style.translate = '';
		const dpr = window.devicePixelRatio || 1;
		const r = node.getBoundingClientRect();
		const fx = frac(r.left * dpr);
		const fy = frac((r.top + window.scrollY) * dpr);
		const dx = fx > 0.01 && fx < 0.99 ? -fx / dpr : 0;
		const dy = fy > 0.01 && fy < 0.99 ? -fy / dpr : 0;
		if (dx || dy) node.style.translate = `${dx}px ${dy}px`;
	};
	const ro = new ResizeObserver(fix);
	ro.observe(document.body);
	ro.observe(node);
	return {
		destroy() {
			ro.disconnect();
			node.style.translate = '';
		}
	};
};

/**
 * use:wipe — entrance for pixel blocks: a stepped clip-path wipe, top → bottom (motion report
 * §1: « entrée en scène, jamais apparition »). Clip only, never a transform, so `use:crisp`
 * inside keeps measuring the final position. Clip and opacity never hide controls from Tab;
 * focus inside finishes the wipe at once. Reduced motion: 0.3 s opacity fade.
 */
export const wipe: Action<HTMLElement, { delay?: number; steps?: number } | undefined> = (
	node,
	options = {}
) => {
	const { delay = 0, steps = 12 } = options;
	let tween: gsap.core.Tween | null = null;
	let stop = () => {};
	if (prefersReducedMotion()) {
		// Opacity only, never visibility: controls inside stay reachable with Tab.
		tween = gsap.fromTo(node, { opacity: 0 }, { opacity: 1, duration: 0.3, delay });
	} else {
		tween = gsap.fromTo(
			node,
			{ clipPath: 'inset(0% 0% 100% 0%)' },
			{
				clipPath: 'inset(0% 0% 0% 0%)',
				duration: duration.lg,
				ease: `steps(${steps})`,
				delay,
				paused: true,
				clearProps: 'clipPath'
			}
		);
		const play = () => tween?.play();
		const stopView = onFirstView(node, play);
		// Keyboard users reach the block before it has scrolled in: show it at once.
		const focus = () => tween?.progress(1);
		node.addEventListener('focusin', focus);
		stop = () => {
			stopView();
			node.removeEventListener('focusin', focus);
		};
	}
	return {
		destroy() {
			stop();
			tween?.revert();
		}
	};
};
