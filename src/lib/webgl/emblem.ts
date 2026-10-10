import { Box2, ExtrudeGeometry, Group, Mesh, ShaderMaterial, Vector2, type Shape } from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import type { CoreStateId } from '#lib/data/divisions.ts';

/** The emblem each state of the Core takes (docs/brand/brand-decision.md). */
export const emblemSources: Record<CoreStateId, string> = {
	holding: '/brand/cardor-monogram.svg',
	interactive: '/brand/interactive.svg',
	sound: '/brand/sound.svg',
	creative: '/brand/creative.svg'
};

/**
 * Brightness of each colour layer of the vectorised emblems, relative to the signal colour:
 * t1 = main tone, t2 = secondary (darker) tone, t3 = accent (the wheel's hub point).
 */
const layerTone: Record<string, number> = { t1: 1, t2: 0.42, t3: 1.6 };

/** Each layer sits a little in front of the previous one, as in the stacked SVG. */
const layerLift: Record<string, number> = { t1: 0, t2: 0.25, t3: 0.5 };

/** Target size of the emblem's largest side, in scene units (the old Core was ~2.3 wide). */
const SIZE = 2.5;

export interface Emblem {
	group: Group;
	dispose(): void;
}

/**
 * Turns one of the brand SVGs into extruded meshes sharing the Core's uniforms.
 * Paths are grouped by their colour layer (`<g class="t1|t2|t3">`) so each tone keeps its depth.
 */
export function buildEmblem(svg: string, makeMaterial: (tone: number) => ShaderMaterial): Emblem {
	const data = new SVGLoader().parse(svg);
	const byLayer = new Map<string, Shape[]>();
	const bounds = new Box2();

	for (const path of data.paths) {
		const node = path.userData?.node as Element | undefined;
		const layer = node?.closest('g[class]')?.getAttribute('class') ?? 't1';
		const shapes = SVGLoader.createShapes(path);
		for (const shape of shapes) {
			for (const p of shape.getPoints(4)) bounds.expandByPoint(p);
		}
		byLayer.set(layer, [...(byLayer.get(layer) ?? []), ...shapes]);
	}

	const size = bounds.getSize(new Vector2());
	const center = bounds.getCenter(new Vector2());
	const scale = SIZE / Math.max(size.x, size.y);
	const depth = Math.max(size.x, size.y) * 0.07;

	const group = new Group();
	const materials: ShaderMaterial[] = [];
	for (const [layer, shapes] of byLayer) {
		const d = depth * (1 + (layerLift[layer] ?? 0));
		const geometry = new ExtrudeGeometry(shapes, {
			depth: d,
			curveSegments: 5,
			bevelEnabled: true,
			bevelThickness: depth * 0.18,
			bevelSize: depth * 0.1,
			bevelSegments: 2
		});
		// SVG space (y down) → centred scene space (y up). Rotating half a turn about x flips y without
		// mirroring the triangles; the base of every layer ends at z = -depth/2 and higher layers
		// protrude towards the camera.
		geometry.translate(-center.x, -center.y, depth / 2 - d);
		geometry.rotateX(Math.PI);
		geometry.scale(scale, scale, scale);
		const material = makeMaterial(layerTone[layer] ?? 1);
		materials.push(material);
		group.add(new Mesh(geometry, material));
	}

	return {
		group,
		dispose() {
			group.traverse((o) => {
				if (o instanceof Mesh) o.geometry.dispose();
			});
			materials.forEach((m) => m.dispose());
		}
	};
}
