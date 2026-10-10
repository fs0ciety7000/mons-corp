import type { Action } from 'svelte/action';
import { gsap, ScrollTrigger, SplitText } from './gsap.ts';
import { duration, ease, isFinePointer, prefersReducedMotion, stagger } from './tokens.ts';

interface RevealOptions {
	/** Split granularity. `block` animates the element as a whole. */
	type?: 'lines' | 'words' | 'chars' | 'block';
	delay?: number;
	/** ScrollTrigger start. Pass `false` to play immediately. */
	start?: string | false;
}

/**
 * use:reveal — masked entrance primitive (motion report §3).
 * Never a bare opacity fade, except under reduced motion.
 */
export const reveal: Action<HTMLElement, RevealOptions | undefined> = (node, options = {}) => {
	const { type = 'lines', delay = 0, start = 'top 85%' } = options;

	if (prefersReducedMotion()) {
		gsap.fromTo(node, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, delay });
		return;
	}

	const ctx = gsap.context(() => {
		const scrollTrigger = start === false ? undefined : { trigger: node, start, once: true };

		if (type === 'block') {
			gsap.fromTo(
				node,
				{ yPercent: 18, autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' },
				{
					yPercent: 0,
					autoAlpha: 1,
					clipPath: 'inset(0 0 0% 0)',
					duration: duration.lg,
					ease: ease.out,
					delay,
					scrollTrigger
				}
			);
			return;
		}

		SplitText.create(node, {
			type: type === 'lines' ? 'lines' : `lines,${type}`,
			mask: 'lines',
			linesClass: 'split-line',
			autoSplit: true,
			onSplit(self) {
				const targets = type === 'lines' ? self.lines : type === 'words' ? self.words : self.chars;
				return gsap.from(targets, {
					yPercent: 110,
					rotate: type === 'chars' ? 6 : 0,
					duration: duration.lg,
					ease: ease.out,
					stagger: stagger[type],
					delay,
					scrollTrigger
				});
			}
		});
		gsap.set(node, { autoAlpha: 1 });
	}, node);

	return { destroy: () => ctx.revert() };
};

/** use:magnetic — element is attracted to the pointer, springs back elastically. */
export const magnetic: Action<HTMLElement, number | undefined> = (node, strength = 0.3) => {
	if (prefersReducedMotion() || !isFinePointer()) return;

	const xTo = gsap.quickTo(node, 'x', { duration: 0.6, ease: 'power3.out' });
	const yTo = gsap.quickTo(node, 'y', { duration: 0.6, ease: 'power3.out' });

	const move = (e: PointerEvent) => {
		const r = node.getBoundingClientRect();
		xTo((e.clientX - (r.left + r.width / 2)) * strength);
		yTo((e.clientY - (r.top + r.height / 2)) * strength);
	};
	const leave = () => {
		gsap.to(node, { x: 0, y: 0, duration: 1, ease: ease.elastic });
	};

	node.addEventListener('pointermove', move);
	node.addEventListener('pointerleave', leave);
	return {
		destroy() {
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerleave', leave);
			gsap.killTweensOf(node);
		}
	};
};

export { ScrollTrigger };
