/** Motion tokens — docs/motion-agent-report.md §2 */

export const ease = {
	out: 'cardor.out',
	inOut: 'cardor.inOut',
	in: 'cardor.in',
	snap: 'cardor.snap',
	elastic: 'elastic.out(1, 0.45)'
} as const;

/** CustomEase path definitions, registered in ./gsap.ts */
export const easeCurves: Record<string, string> = {
	'cardor.out': 'M0,0 C0.16,1 0.3,1 1,1',
	'cardor.inOut': 'M0,0 C0.77,0 0.175,1 1,1',
	'cardor.in': 'M0,0 C0.7,0 0.84,0 1,1',
	'cardor.snap': 'M0,0 C0.87,0 0.13,1 1,1'
};

export const duration = {
	xs: 0.2,
	sm: 0.45,
	md: 0.8,
	lg: 1.2,
	xl: 1.8
} as const;

export const stagger = {
	chars: 0.028,
	words: 0.06,
	lines: 0.1,
	cards: 0.12
} as const;

export function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * True only for a real mouse/trackpad device. Phones and tablets are excluded even when
 * a stylus makes the browser report a fine pointer (seen on Samsung Internet).
 */
export function isFinePointer(): boolean {
	if (typeof window === 'undefined') return false;
	return (
		window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
		!window.matchMedia('(any-pointer: coarse)').matches
	);
}

/** Any touch-capable input (phone, tablet, touch laptop). */
export function isTouch(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(any-pointer: coarse)').matches || navigator.maxTouchPoints > 0;
}

/**
 * Run `fn` once, the first time `node` enters the viewport. IntersectionObserver-based on
 * purpose: one-shot entrances must never depend on scroll-position bookkeeping, which some
 * mobile browsers break (missing reveals on Samsung Internet, 2026-10-10).
 */
export function onFirstView(node: Element, fn: () => void, rootMargin = '0px 0px -12% 0px') {
	if (typeof IntersectionObserver === 'undefined') {
		fn();
		return () => {};
	}
	const io = new IntersectionObserver(
		(entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				io.disconnect();
				fn();
			}
		},
		{ rootMargin }
	);
	io.observe(node);
	return () => io.disconnect();
}
