import { gsap } from '#lib/motion/gsap.ts';
import type { LogoName } from '#lib/data/logos.ts';

/**
 * Emblem motion (docs/brand/emblem-motion.md).
 * The sprite <use> is fine for static marks, but its shadow tree cannot be animated part by
 * part. Animated emblems are therefore inlined on the client from the standalone SVGs in
 * /brand (cached), then each motif gets its own timeline.
 */
const SVG_NS = 'http://www.w3.org/2000/svg';
const cache = new Map<LogoName, Promise<string>>();

/** Inner markup (layer groups) of a standalone emblem SVG. */
export function loadEmblem(name: LogoName): Promise<string> {
	let p = cache.get(name);
	if (!p) {
		p = fetch(`/brand/${name}.svg`)
			.then((r) => (r.ok ? r.text() : Promise.reject(new Error(r.statusText))))
			.then((txt) => {
				const doc = new DOMParser().parseFromString(txt, 'image/svg+xml');
				// Wrap every positioned shape: the outer <g> keeps its translate(), the inner
				// <g class="part"> is free to be animated without losing its position.
				doc.querySelectorAll('path, circle').forEach((shape) => {
					const outer = doc.createElementNS(SVG_NS, 'g');
					const inner = doc.createElementNS(SVG_NS, 'g');
					inner.setAttribute('class', 'part');
					const t = shape.getAttribute('transform');
					if (t) {
						outer.setAttribute('transform', t);
						shape.removeAttribute('transform');
					}
					shape.replaceWith(outer);
					outer.appendChild(inner);
					inner.appendChild(shape);
				});
				return doc.documentElement.innerHTML;
			});
		cache.set(name, p);
	}
	return p;
}

interface Box {
	el: SVGGraphicsElement;
	x: number;
	y: number;
	w: number;
	h: number;
}

/** Animatable parts with their bounding boxes in symbol space (outer <g> holds translate()). */
function boxes(root: Element, selector = '.part'): Box[] {
	return [...root.querySelectorAll<SVGGraphicsElement>(selector)].map((el) => {
		const b = el.getBBox();
		const m = /translate\(([-\d.]+),([-\d.]+)\)/.exec(
			el.parentElement?.getAttribute('transform') ?? ''
		);
		const tx = m ? +m[1] : 0;
		const ty = m ? +m[2] : 0;
		return { el, x: b.x + tx, y: b.y + ty, w: b.width, h: b.height };
	});
}

export interface EmblemParts {
	root: SVGGElement;
	/** Car d'Or wheels (for scroll-linked rotation, e.g. the footer climb). */
	wheels: SVGGraphicsElement[];
}

const rand = gsap.utils.random;

/** Build the paused signature timeline of an emblem. */
export function emblemTimeline(name: LogoName, root: SVGGElement, width: number) {
	const tl = gsap.timeline({ paused: true });
	const parts: EmblemParts = { root, wheels: [] };
	const all = boxes(root);

	switch (name) {
		case 'cardor-emblem': {
			// The Car d'Or rolls: wheels turn, the body bounces on the cobbles.
			const wheels = all.filter((b) => Math.abs(b.w / b.h - 1) < 0.12 && b.w > width * 0.25);
			parts.wheels = wheels.map((b) => b.el);
			const body = all.filter((b) => !wheels.includes(b)).map((b) => b.el);
			tl.to(
				parts.wheels,
				{ rotation: '+=360', duration: 1.3, ease: 'cardor.inOut', transformOrigin: '50% 50%' },
				0
			)
				.to(body, { y: -10, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 3 }, 0.1)
				.fromTo(
					root,
					{ x: 0 },
					{ x: 14, duration: 0.65, ease: 'power2.inOut', yoyo: true, repeat: 1 },
					0
				);
			break;
		}
		case 'cardor-monogram': {
			const core = root.querySelectorAll('.t3 .part');
			tl.to(
				root,
				{ rotation: '+=360', duration: 1.4, ease: 'cardor.inOut', transformOrigin: '50% 50%' },
				0
			).fromTo(
				core,
				{ scale: 1 },
				{
					scale: 2.4,
					duration: 0.25,
					ease: 'power2.out',
					yoyo: true,
					repeat: 1,
					transformOrigin: '50% 50%'
				},
				0.55
			);
			break;
		}
		case 'interactive': {
			// The dragon glitches: facets jump out of place in hard steps, then snap back.
			const facets = boxes(root, '.t2 .part').map((b) => b.el);
			tl.fromTo(
				root,
				{ skewX: 0 },
				{
					skewX: -10,
					duration: 0.24,
					ease: 'steps(3)',
					yoyo: true,
					repeat: 1,
					transformOrigin: '50% 50%'
				},
				0
			)
				.to(
					facets,
					{
						x: () => rand(-28, 28),
						y: () => rand(-18, 18),
						opacity: () => rand(0.15, 1),
						duration: 0.07,
						ease: 'none',
						stagger: { each: 0.012, from: 'random' },
						repeat: 4,
						repeatRefresh: true
					},
					0
				)
				.to(facets, { x: 0, y: 0, opacity: 1, duration: 0.18, ease: 'cardor.snap' });
			break;
		}
		case 'sound': {
			// The belfry rings: its wave bars vibrate outwards from the centre, like a carillon.
			const bars = all.filter((b) => b.h > b.w * 2.2).map((b) => b.el);
			tl.to(bars, {
				scaleY: () => rand(0.35, 1.7),
				duration: 0.16,
				ease: 'sine.inOut',
				transformOrigin: '50% 50%',
				stagger: { each: 0.004, from: 'center' },
				repeat: 5,
				yoyo: true,
				repeatRefresh: true
			}).to(bars, { scaleY: 1, duration: 0.4, ease: 'cardor.out' });
			break;
		}
		case 'creative': {
			// The monkey scratches its head and the quill writes.
			const nib = all.reduce((a, b) => (b.x + b.w > a.x + a.w ? b : a)).el;
			tl.to(
				root,
				{ rotation: -7, y: -10, duration: 0.25, ease: 'power2.out', transformOrigin: '45% 100%' },
				0
			)
				.to(root, { rotation: 4, duration: 0.3, ease: 'power2.inOut' })
				.to(root, { rotation: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' })
				.to(
					nib,
					{
						rotation: 16,
						duration: 0.11,
						ease: 'sine.inOut',
						yoyo: true,
						repeat: 7,
						transformOrigin: '0% 100%'
					},
					0.1
				);
			break;
		}
	}
	return { tl, parts };
}
