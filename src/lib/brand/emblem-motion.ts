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
	/** Car d'Or wheels (with their hub caps), for scroll-linked rotation such as the footer climb. */
	wheels: SVGGraphicsElement[];
}

const rand = gsap.utils.random;
const centre = (b: Box) => ({ cx: b.x + b.w / 2, cy: b.y + b.h / 2 });
/** transformOrigin (in % of the part's own box) for a pivot given in symbol space. */
const originAt = (b: Box, px: number, py: number) =>
	`${(((px - b.x) / b.w) * 100).toFixed(2)}% ${(((py - b.y) / b.h) * 100).toFixed(2)}%`;
const inside = (b: Box, o: Box) => {
	const { cx, cy } = centre(b);
	return cx > o.x && cx < o.x + o.w && cy > o.y && cy < o.y + o.h;
};

/**
 * Signature motion of an emblem (docs/brand/emblem-motion.md, revised after the Motion review).
 * `build()` creates a fresh timeline at each play, so relative values (`+=360`) and random
 * offsets are evaluated at play time and never fight other tweens (e.g. the footer scroll).
 */
export function emblemMotion(name: LogoName, root: SVGGElement, vb: number[]) {
	const [vx, vy, vw, vh] = vb;
	const all = boxes(root);
	const parts: EmblemParts = { root, wheels: [] };
	let build: () => gsap.core.Timeline;

	switch (name) {
		case 'cardor-emblem': {
			// The Car d'Or rolls on the cobbles: wheels (and hubs) turn, the body settles in a
			// damped bounce pitching around the rear wheel. No translation: no reverse skid.
			const wheelBoxes = all.filter((b) => Math.abs(b.w / b.h - 1) < 0.12 && b.w > vw * 0.25);
			const hubs = all.filter(
				(b) => !wheelBoxes.includes(b) && wheelBoxes.some((w) => inside(b, w))
			);
			parts.wheels = [...wheelBoxes, ...hubs].map((b) => b.el);
			const bodyBoxes = all.filter((b) => !wheelBoxes.includes(b) && !hubs.includes(b));
			const body = bodyBoxes.map((b) => b.el);
			const rear = wheelBoxes.reduce((a, b) => (b.x > a.x ? b : a), wheelBoxes[0]);
			const rx = rear ? rear.x + rear.w / 2 : vx + vw * 0.8;
			const ry = rear ? rear.y + rear.h / 2 : vy + vh * 0.8;
			// Wheels spin on their centre; hub caps spin around their wheel's centre.
			gsap.set(
				wheelBoxes.map((b) => b.el),
				{ transformOrigin: '50% 50%' }
			);
			for (const h of hubs) {
				const w = wheelBoxes.find((wb) => inside(h, wb))!;
				gsap.set(h.el, { transformOrigin: originAt(h, w.x + w.w / 2, w.y + w.h / 2) });
			}
			build = () =>
				gsap
					.timeline()
					.to(parts.wheels, { rotation: '+=360', duration: 1.3, ease: 'cardor.out' }, 0)
					.to(
						body,
						{ keyframes: { y: [0, -8, 0, -4, 0, -1.5, 0] }, duration: 1.1, ease: 'none' },
						0.05
					)
					.to(
						body,
						{
							rotation: -1.5,
							duration: 0.3,
							ease: 'cardor.out',
							yoyo: true,
							repeat: 1,
							transformOrigin: (i: number) => originAt(bodyBoxes[i], rx, ry)
						},
						0.05
					);
			break;
		}
		case 'cardor-monogram': {
			const core = root.querySelectorAll('.t3 .part');
			// Long settle (cardor.out) so the 14 spokes never strobe backwards.
			build = () =>
				gsap
					.timeline()
					.to(root, { rotation: '+=360', duration: 1.6, ease: 'cardor.out', svgOrigin: '50 50' }, 0)
					.to(core, { scale: 1.6, duration: 0.2, ease: 'cardor.out', svgOrigin: '50 50' }, 0.15)
					.to(core, { scale: 1, duration: 0.9, ease: 'cardor.elastic', svgOrigin: '50 50' }, 0.35);
			break;
		}
		case 'interactive': {
			// Glitch: facets jump by whole pixels in hard steps, an RGB-split ghost flashes, then
			// everything snaps back. Opacity stays at 1 (a glitch, not a flicker).
			const t2 = root.querySelector<SVGGElement>('.t2');
			const facets = boxes(root, '.t2 .part').map((b) => b.el);
			const ghost = t2?.cloneNode(true) as SVGGElement | undefined;
			if (ghost && t2) {
				ghost.removeAttribute('class');
				ghost.setAttribute('fill', '#ff2bd6');
				ghost.setAttribute('style', 'mix-blend-mode:screen;opacity:0');
				ghost.setAttribute('aria-hidden', 'true');
				t2.after(ghost);
			}
			const px = () => {
				const r = root.ownerSVGElement?.getBoundingClientRect().width || vw;
				return vw / r; // user units per screen pixel
			};
			build = () => {
				const u = px();
				const jump = () => gsap.utils.snap(u, rand(-1, 1) * Math.max(0.05 * vw, 6 * u));
				return gsap
					.timeline()
					.to(
						root,
						{
							skewX: -10,
							duration: 0.24,
							ease: 'steps(3)',
							yoyo: true,
							repeat: 1,
							svgOrigin: `${vx + vw / 2} ${vy + vh / 2}`
						},
						0
					)
					.to(
						facets,
						{
							x: jump,
							y: jump,
							duration: 0.06,
							ease: 'none',
							stagger: { each: 0.01, from: 'random' },
							repeat: 4,
							repeatRefresh: true
						},
						0
					)
					.to(
						ghost ?? [],
						{
							keyframes: [
								{ opacity: 0.7, x: 4 * u },
								{ opacity: 0, x: -3 * u },
								{ opacity: 0.55, x: 2 * u },
								{ opacity: 0, x: 0 }
							],
							duration: 0.36,
							ease: 'steps(1)'
						},
						0.04
					)
					.to(facets, { x: 0, y: 0, duration: 0.18, ease: 'cardor.snap' });
			};
			break;
		}
		case 'sound': {
			// One carillon strike that dies away: the horizontal wave band rings strongly from
			// the centre outwards, the wall bars barely breathe from their base, the bell arcs ripple.
			const bars = all.filter((b) => b.h > b.w * 2.2);
			const band = bars.filter((b) => {
				const { cy } = centre(b);
				return cy > vy + vh * 0.36 && cy < vy + vh * 0.6;
			});
			const wall = bars.filter((b) => !band.includes(b) && centre(b).cy >= vy + vh * 0.6);
			const arcs = all.filter((b) => !bars.includes(b) && centre(b).cy < vy + vh * 0.6);
			const mid = vx + vw / 2;
			const byDistance = (list: Box[]) =>
				[...list]
					.sort((a, b) => Math.abs(centre(a).cx - mid) - Math.abs(centre(b).cx - mid))
					.map((b) => b.el);
			build = () =>
				gsap
					.timeline()
					.to(
						byDistance(band),
						{
							keyframes: { scaleY: [1, 1.5, 0.7, 1.25, 0.85, 1.1, 1] },
							duration: 1.2,
							ease: 'none',
							transformOrigin: '50% 50%',
							stagger: { each: 0.012 }
						},
						0
					)
					.to(
						byDistance(wall),
						{
							keyframes: { scaleY: [1, 1.06, 0.95, 1.03, 1] },
							duration: 1.0,
							ease: 'none',
							transformOrigin: '50% 100%',
							stagger: { each: 0.006 }
						},
						0.08
					)
					.to(
						arcs.map((b) => b.el),
						{
							scale: 1.04,
							duration: 0.25,
							ease: 'cardor.out',
							yoyo: true,
							repeat: 1,
							transformOrigin: '50% 50%',
							stagger: { each: 0.03, from: 'center' }
						},
						0.05
					);
			break;
		}
		case 'creative': {
			// The monkey scratches its head (head + arm only, around the shoulder) and the quill
			// writes one slow stroke, leaving an ink squiggle that fades.
			const nibBox = all.reduce((a, b) => (b.x + b.w > a.x + a.w ? b : a));
			const upperBoxes = all.filter((b) => b !== nibBox && centre(b).cy < vy + vh * 0.42);
			const upper = upperBoxes.map((b) => b.el);
			const [sx, sy] = [vx + vw * 0.42, vy + vh * 0.42];
			const tip = { x: nibBox.x + nibBox.w, y: nibBox.y };
			const ink = document.createElementNS(SVG_NS, 'path');
			const s = vw * 0.06;
			ink.setAttribute(
				'd',
				`M${tip.x} ${tip.y} c ${s * 0.4} ${-s * 0.6}, ${s} ${-s * 0.2}, ${s * 0.7} ${s * 0.35} s ${s * 0.6} ${s * 0.5}, ${s * 1.1} ${-s * 0.15}`
			);
			ink.setAttribute('fill', 'none');
			ink.setAttribute('stroke', 'var(--logo-t1, #FFB547)');
			ink.setAttribute('stroke-width', '2');
			ink.setAttribute('stroke-linecap', 'round');
			ink.setAttribute('vector-effect', 'non-scaling-stroke');
			ink.setAttribute('opacity', '0');
			root.appendChild(ink);
			build = () =>
				gsap
					.timeline()
					.to(
						upper,
						{
							keyframes: { rotation: [0, -8, 4, -6, 3, 0] },
							duration: 0.9,
							ease: 'none',
							transformOrigin: (i: number) => originAt(upperBoxes[i], sx, sy)
						},
						0
					)
					.to(
						nibBox.el,
						{
							rotation: 10,
							duration: 0.45,
							ease: 'cardor.inOut',
							yoyo: true,
							repeat: 1,
							transformOrigin: '0% 100%'
						},
						0.15
					)
					.fromTo(
						ink,
						{ opacity: 1, drawSVG: '0%' },
						{ drawSVG: '100%', duration: 0.6, ease: 'cardor.out' },
						0.35
					)
					.to(ink, { opacity: 0, duration: 0.6, ease: 'cardor.out' }, 1.0);
			break;
		}
		default:
			build = () => gsap.timeline();
	}
	return { build, parts };
}

/**
 * Reveal on first view, tailored per motif (Motion review):
 * - monogram & monkey: "tracé à la plume", outlines drawn in reading order, then fills;
 * - Car d'Or: same pen draw;
 * - belfry: wave bars grow from their base, from the centre outwards;
 * - dragon: glitch boot-up, facets appear in hard random steps.
 */
export function revealTimeline(name: LogoName, root: SVGGElement) {
	const shapes = [...root.querySelectorAll<SVGGeometryElement>('.part > *')];
	const tl = gsap.timeline({ paused: true });

	if (name === 'sound') {
		const parts = boxes(root);
		const mid = parts.reduce((m, b) => m + b.x + b.w / 2, 0) / parts.length;
		const ordered = [...parts]
			.sort((a, b) => Math.abs(a.x - mid) - Math.abs(b.x - mid))
			.map((b) => b.el);
		gsap.set(ordered, { scaleY: 0, transformOrigin: '50% 100%' });
		return tl.to(ordered, {
			scaleY: 1,
			duration: 0.9,
			ease: 'cardor.out',
			stagger: { amount: 0.8 }
		});
	}
	if (name === 'interactive') {
		const parts = [...root.querySelectorAll<SVGGElement>('.part')];
		gsap.set(parts, { autoAlpha: 0 });
		return tl
			.to(parts, {
				autoAlpha: 1,
				duration: 0.01,
				ease: 'none',
				stagger: { each: 0.025, from: 'random' }
			})
			.fromTo(root, { skewX: -12 }, { skewX: 0, duration: 0.5, ease: 'steps(5)' }, 0);
	}

	// Pen draw: each shape stroked in its own layer colour, drawn left → right, then filled.
	for (const s of shapes) {
		const layer = s.closest('[fill]');
		s.setAttribute('stroke', layer?.getAttribute('fill') ?? 'currentColor');
		s.setAttribute('stroke-width', '1.25');
		s.setAttribute('vector-effect', 'non-scaling-stroke');
		s.setAttribute('stroke-linejoin', 'round');
	}
	const ordered = boxes(root)
		.sort((a, b) => a.x - b.x || a.y - b.y)
		.map((b) => b.el.firstElementChild as SVGGeometryElement);
	gsap.set(ordered, { fillOpacity: 0, drawSVG: '0%' });
	return tl
		.to(ordered, { drawSVG: '100%', duration: 1.6, ease: 'cardor.inOut', stagger: { amount: 0.9 } })
		.to(
			ordered,
			{ fillOpacity: 1, duration: 0.7, ease: 'cardor.out', stagger: { amount: 0.25 } },
			'-=0.5'
		)
		.to(ordered, { strokeOpacity: 0, duration: 0.5 }, '-=0.3');
}
