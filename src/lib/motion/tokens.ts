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

export function isFinePointer(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}
