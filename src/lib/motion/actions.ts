import type { Action } from 'svelte/action';
import { gsap, ScrollTrigger, SplitText } from './gsap.ts';
import {
	duration,
	ease,
	isFinePointer,
	onFirstView,
	prefersReducedMotion,
	stagger
} from './tokens.ts';

interface RevealOptions {
	/** Split granularity. `block` animates the element as a whole. */
	type?: 'lines' | 'words' | 'chars' | 'block';
	delay?: number;
	/** Pass `false` to play immediately instead of on first view. */
	start?: string | false;
}

/**
 * use:reveal — masked entrance primitive (motion report §3).
 * Never a bare opacity fade, except under reduced motion. Triggered on first view through
 * IntersectionObserver (see onFirstView), not ScrollTrigger.
 */
export const reveal: Action<HTMLElement, RevealOptions | undefined> = (node, options = {}) => {
	const { type = 'lines', delay = 0, start = 'top 85%' } = options;

	if (prefersReducedMotion()) {
		gsap.fromTo(node, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, delay });
		return;
	}

	const immediate = start === false;
	let revealed = immediate;
	let current: gsap.core.Animation | null = null;
	const play = () => {
		revealed = true;
		current?.play();
	};

	const ctx = gsap.context(() => {
		if (type === 'block') {
			current = gsap.fromTo(
				node,
				{ yPercent: 18, autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' },
				{
					yPercent: 0,
					autoAlpha: 1,
					clipPath: 'inset(0 0 0% 0)',
					duration: duration.lg,
					ease: ease.out,
					delay,
					paused: !revealed
				}
			);
			return;
		}

		SplitText.create(node, {
			type: type === 'lines' ? 'lines' : `lines,${type}`,
			mask: 'lines',
			linesClass: 'split-line',
			// aria-label is only valid on headings: elsewhere the split text stays plain text.
			aria: /^H[1-6]$/.test(node.tagName) ? 'auto' : 'none',
			autoSplit: true,
			onSplit(self) {
				const targets = type === 'lines' ? self.lines : type === 'words' ? self.words : self.chars;
				// Re-splits (resize, fonts) must not hide text that was already revealed.
				const tween = gsap.from(targets, {
					yPercent: 110,
					rotate: type === 'chars' ? 6 : 0,
					duration: duration.lg,
					ease: ease.out,
					stagger: stagger[type],
					delay,
					paused: !revealed
				});
				if (revealed && current) tween.progress(1);
				current = tween;
				return tween;
			}
		});
		gsap.set(node, { autoAlpha: 1 });
	}, node);

	const stop = immediate ? () => {} : onFirstView(node, play);

	return {
		destroy: () => {
			stop();
			ctx.revert();
		}
	};
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

const GLYPHS = '▚▞░▒▓/\\<>_-=+*#';

interface ScrambleOptions {
	/** Play when the element scrolls into view. */
	onReveal?: boolean;
	/** CSS selector of an ancestor whose hover replays the effect. */
	hoverParent?: string;
	duration?: number;
}

/**
 * use:scramble — CM Interactive signature (docs/sites/interactive.md):
 * characters resolve left → right out of block glyphs.
 */
export const scramble: Action<HTMLElement, ScrambleOptions | undefined> = (node, options = {}) => {
	const { onReveal = true, hoverParent, duration: d = 0.8 } = options;
	if (prefersReducedMotion()) return;

	const final = node.textContent ?? '';
	const state = { p: 0 };
	let tween: gsap.core.Tween | null = null;

	const render = () => {
		const n = Math.floor(state.p * final.length);
		let out = final.slice(0, n);
		for (let i = n; i < final.length; i++) {
			out += final[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
		}
		node.textContent = out;
	};
	const play = () => {
		tween?.kill();
		state.p = 0;
		tween = gsap.to(state, {
			p: 1,
			duration: d,
			ease: 'cardor.snap',
			onUpdate: render,
			onComplete: () => (node.textContent = final)
		});
	};

	let stop = () => {};
	if (onReveal) {
		node.textContent = final.replace(/\S/g, '░');
		stop = onFirstView(node, play, '0px 0px -6% 0px');
	}
	const parent = hoverParent ? node.closest<HTMLElement>(hoverParent) : null;
	parent?.addEventListener('pointerenter', play);

	return {
		destroy() {
			tween?.kill();
			stop();
			parent?.removeEventListener('pointerenter', play);
			node.textContent = final;
		}
	};
};
