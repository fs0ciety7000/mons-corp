import raw from './manifest.json';
import { fontFace } from './pixel.ts';
import type { FontStyle, Glyph, Manifest } from './types.ts';

export { ASSET_BASE, asset, fontFace, NNBSP, pixelVars, pua } from './pixel.ts';

/**
 * Beffroi 8 specimen data (creative.cardormedia.com/beffroi-8). Everything on the page is
 * derived from the synchronised manifest, so new styles (Bold, 16 Display, 5 Mini) appear
 * without any code change.
 */
export const manifest = raw as Manifest;

/** Complete archive, named by the font's build (`beffroi-vX.Y.Z.zip`, ARCHITECTURE §3). */
export const zipPath = `beffroi-v${manifest.version}.zip`;

/** A pre-release (`1.0.0-dev`) is still being drawn. */
export const isDraft = manifest.version.includes('-');

/** The style shown first (hero, demos): the only one preloaded. */
export const primary: FontStyle = manifest.styles[0];

export const styleName = (s: FontStyle) => `${s.family} ${s.style}`;

/** `U+00E9`, `U+E100`, `U+1F600`. */
export const codepoint = (cp: number) => 'U+' + cp.toString(16).toUpperCase().padStart(4, '0');

/** Private Use Area: the glyph has no meaning outside this font, its label is its name. */
export const isPua = (cp: number) =>
	(cp >= 0xe000 && cp <= 0xf8ff) || (cp >= 0xf0000 && cp <= 0xffffd) || cp >= 0x100000;

/** Spaces and other glyphs with no ink. */
export const isBlank = (g: Glyph) => g.width === 0;

/** Accessible name of a glyph: PUA and blank glyphs are read by their label. */
export function glyphName(g: Glyph) {
	if (isPua(g.cp) || isBlank(g)) return g.label ?? g.name;
	return g.label ? `${g.char}, ${g.label}` : g.char;
}

/** Licence identifiers of the manifest, in plain French. */
const licenses: Record<string, { title: string; text: string }> = {
	'CARDOR-reserved': {
		title: 'Usage réservé aux productions CARDOR Media',
		text: 'Beffroi 8 est la police maison de CARDOR Media et de ses studios. Son usage est réservé à leurs productions : aucune redistribution ni usage par un tiers sans accord écrit. Une question ? Écrivez-nous.'
	}
};

export function licenseOf(id: string) {
	return licenses[id] ?? { title: `Licence ${id}`, text: 'Voir le fichier LICENSE de l’archive.' };
}

/** Category id → label, plus a bucket for uncategorised glyphs. */
export const OTHER = '__other';
export function categoriesOf(style: FontStyle) {
	const used = new Set(style.glyphs.map((g) => g.cat ?? OTHER));
	const list = manifest.categories
		.filter((c) => used.has(c.id))
		.map((c) => ({ ...c, count: style.glyphs.filter((g) => g.cat === c.id).length }));
	const known = new Set(manifest.categories.map((c) => c.id));
	const orphans = style.glyphs.filter((g) => g.cat === null || !known.has(g.cat));
	if (orphans.length) list.push({ id: OTHER, label: 'Autres', count: orphans.length });
	return list;
}

export function inCategory(g: Glyph, cat: string) {
	if (cat === 'all') return true;
	if (cat === OTHER) return g.cat === null || !manifest.categories.some((c) => c.id === g.cat);
	return g.cat === cat;
}

/** Characters of `text` the style does not draw (line breaks ignored). */
export function missingChars(style: FontStyle, text: string) {
	const have = new Set(style.glyphs.map((g) => g.char));
	const missing = new Set<string>();
	for (const ch of text) if (ch !== '\n' && ch !== '\r' && !have.has(ch)) missing.add(ch);
	return [...missing];
}

/** `@font-face` rules for every style of the manifest (same sources as fonts/css/beffroi.css). */
export const fontFaces = manifest.styles.map(fontFace).join('');
