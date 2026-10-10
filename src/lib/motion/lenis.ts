import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap.ts';
import { isTouch, prefersReducedMotion } from './tokens.ts';

let instance: Lenis | null = null;

/**
 * Smooth scroll driven by gsap.ticker (ADR-004: one ticker only).
 * Disabled for reduced motion; touch devices keep native scrolling.
 */
export function startSmoothScroll(): () => void {
	// Touch devices keep native scrolling (inertia, address bar, a11y): no Lenis at all.
	if (prefersReducedMotion() || isTouch() || instance) return () => {};

	const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, autoRaf: false });
	instance = lenis;

	lenis.on('scroll', ScrollTrigger.update);
	const tick = (time: number) => lenis.raf(time * 1000);
	gsap.ticker.add(tick);

	return () => {
		gsap.ticker.remove(tick);
		lenis.destroy();
		instance = null;
	};
}

export function getLenis(): Lenis | null {
	return instance;
}

export function scrollToTop() {
	if (instance) instance.scrollTo(0, { immediate: true, force: true });
	else window.scrollTo(0, 0);
}
