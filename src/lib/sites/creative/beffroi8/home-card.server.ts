import { fontFace, type PixelFace } from './pixel.ts';
import { primary } from './specimen.ts';

/**
 * What the creative home's « Premières planches » card needs from the manifest, computed by
 * the (prerendered) server load: the manifest itself never reaches the home's client bundle.
 */
export function beffroiCard(): { face: PixelFace; css: string } {
	return {
		face: {
			cssFamily: primary.cssFamily,
			cssWeight: primary.cssWeight,
			grid: primary.grid,
			metrics: { lineHeight: primary.metrics.lineHeight }
		},
		css: fontFace(primary)
	};
}
