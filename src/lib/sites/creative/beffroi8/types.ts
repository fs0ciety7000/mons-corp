/**
 * Beffroi 8 manifest — mirrors fs0ciety7000/beffroi-8 `schema/manifest.schema.json`
 * (source of truth, docs/ARCHITECTURE.md §3 of that repo). The JSON next to this file is
 * synchronised by `scripts/sync-mons-corp.sh`: never edit it by hand.
 */

/** Lower-case slug: `^[a-z0-9][a-z0-9-]*$`. */
export type Slug = string;

/** Path relative to the font's `dist/` (served under `/sites/creative/beffroi-8/`). */
export type DistPath = string;

export interface Category {
	id: Slug;
	label: string;
}

export interface Metrics {
	/** All metrics are in font pixels (1 px = `pxUnits` font units). */
	cap: number;
	xHeight: number;
	ascent: number;
	descent: number;
	/** Rows above the baseline (accents included). */
	top: number;
	/** Natural line height, in font pixels. */
	lineHeight: number;
}

export interface StyleFiles {
	ttf: DistPath;
	otf: DistPath;
	woff2: DistPath;
	/** BMFont, text format. */
	fnt: DistPath;
	/** BMFont, XML format (the one Phaser 3 `load.bitmapFont` reads). */
	xml: DistPath;
	/** Atlas: white glyphs on transparent, 1 px padding. */
	png: DistPath;
	/** Same data as the BMFont, as JSON, for a hand-made canvas renderer. */
	json: DistPath;
}

export interface Glyph {
	/** Unicode code point (0 – 0x10FFFF). */
	cp: number;
	/** The character itself (one code point). */
	char: string;
	/** AGL glyph name, `uniXXXX` for the Private Use Area. */
	name: string;
	/** Category id, or null when the glyph belongs to none. */
	cat: Slug | null;
	/** Advance width, font pixels. */
	advance: number;
	/** Ink width, font pixels. */
	width: number;
	/** French description (always set for PUA and invisible glyphs), or null. */
	label: string | null;
}

export interface FontStyle {
	id: Slug;
	family: string;
	style: string;
	cssFamily: string;
	cssWeight: number;
	/** Pixel grid (em height in font pixels): 5, 8, 16… */
	grid: number;
	upm: number;
	pxUnits: number;
	metrics: Metrics;
	/** CSS sizes (px) where every glyph pixel lands on whole CSS pixels. */
	crispSizes: number[];
	files: StyleFiles;
	glyphs: Glyph[];
}

export interface Manifest {
	/** Semver, pre-release allowed (`1.0.0-dev`). */
	version: string;
	/** Short git hash, or `unknown`. */
	commit: string;
	license: 'CARDOR-reserved';
	categories: Category[];
	styles: FontStyle[];
}

/** BMFont data as exported to `bitmap/<slug>.json`. */
export interface BitmapChar {
	id: number;
	x: number;
	y: number;
	width: number;
	height: number;
	xoffset: number;
	yoffset: number;
	xadvance: number;
	page: number;
}

export interface BitmapFont {
	info: { face: string; size: number };
	common: { lineHeight: number; base: number; scaleW: number; scaleH: number; pages: number };
	pages: string[];
	chars: BitmapChar[];
	kernings?: { first: number; second: number; amount: number }[];
}
