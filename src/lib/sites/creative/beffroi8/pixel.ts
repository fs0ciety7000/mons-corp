import type { FontStyle } from './types.ts';

/**
 * Manifest-free helpers for pixel text. The creative home imports only this module (plus a
 * few values its server load derives from the manifest), so the 150 KB manifest stays out of
 * its client bundle; the specimen re-exports everything through specimen.ts.
 */

/** Public base of the synchronised `dist/` (static/sites/creative/beffroi-8/). */
export const ASSET_BASE = '/sites/creative/beffroi-8/';

export const asset = (path: string) => ASSET_BASE + path;

/** Narrow no-break space (U+202F), before ! ? ; : and inside « » in French. */
export const NNBSP = String.fromCharCode(0x202f);

/** A Private Use Area character, written by code point so sources stay readable. */
export const pua = (cp: number) => String.fromCodePoint(cp);

/** What sizing a pixel text needs from a style. */
export type PixelFace = Pick<FontStyle, 'cssFamily' | 'cssWeight' | 'grid'> & {
	metrics: Pick<FontStyle['metrics'], 'lineHeight'>;
};

/**
 * Inline CSS custom properties that size a `.pixel` element (see pixel.css): the CSS
 * font-size is always `grid × k` px, a whole multiple of the grid, so every font pixel
 * covers exactly k CSS pixels.
 */
export function pixelVars(style: PixelFace, k?: number) {
	const vars = [
		`--pixel-family: '${style.cssFamily}'`,
		`--pixel-weight: ${style.cssWeight}`,
		`--pixel-grid: ${style.grid}`,
		`--pixel-lh: ${style.metrics.lineHeight}`
	];
	if (k) vars.push(`--pixel-k: ${k}`);
	return vars.join('; ');
}

/** `@font-face` rule of one style (same sources as fonts/css/beffroi.css). */
export const fontFace = (s: Pick<FontStyle, 'cssFamily' | 'cssWeight' | 'files'>) =>
	`@font-face{font-family:'${s.cssFamily}';src:url('${asset(s.files.woff2)}') format('woff2'),url('${asset(s.files.ttf)}') format('truetype');font-weight:${s.cssWeight};font-style:normal;font-display:swap}`;
