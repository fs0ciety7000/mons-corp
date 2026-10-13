import type { BitmapChar, BitmapFont } from './types.ts';

/**
 * Minimal BMFont renderer for the specimen's « canvas maison » preview: the way a game draws
 * Beffroi 8 from `bitmap/<slug>.json` + `.png`, without any engine. Nearest-neighbour only,
 * whole-number scales only. Browser-only: call it from onMount / $effect.
 */
export interface LoadedBitmapFont {
	font: BitmapFont;
	atlas: HTMLImageElement;
	chars: Map<number, BitmapChar>;
	kerning: Map<string, number>;
}

const cache = new Map<string, Promise<LoadedBitmapFont>>();

export function loadBitmapFont(jsonUrl: string, pngUrl: string): Promise<LoadedBitmapFont> {
	let p = cache.get(jsonUrl);
	if (!p) {
		p = Promise.all([
			fetch(jsonUrl).then((r) => {
				if (!r.ok) throw new Error(`${jsonUrl}: ${r.status}`);
				return r.json() as Promise<BitmapFont>;
			}),
			new Promise<HTMLImageElement>((resolve, reject) => {
				const img = new Image();
				img.decoding = 'async';
				img.onload = () => resolve(img);
				img.onerror = () => reject(new Error(`${pngUrl}: image`));
				img.src = pngUrl;
			})
		]).then(([font, atlas]) => ({
			font,
			atlas,
			chars: new Map(font.chars.map((c) => [c.id, c])),
			kerning: new Map((font.kernings ?? []).map((k) => [`${k.first},${k.second}`, k.amount]))
		}));
		p.catch(() => cache.delete(jsonUrl));
		cache.set(jsonUrl, p);
	}
	return p;
}

/** Break `text` into lines no wider than `maxWidth` font pixels (word wrap, then hard wrap). */
function layout(bf: LoadedBitmapFont, text: string, maxWidth: number) {
	const adv = (cp: number) => bf.chars.get(cp)?.xadvance ?? bf.chars.get(63)?.xadvance ?? 0;
	const width = (s: string) => [...s].reduce((w, ch) => w + adv(ch.codePointAt(0)!), 0);
	const lines: string[] = [];
	for (const para of text.replace(/\r/g, '').split('\n')) {
		let line = '';
		for (const word of para.split(/(?<=[ \u00a0\u2009\u202f])/)) {
			// Like CSS, a trailing space may hang past the edge.
			if (line && width((line + word).trimEnd()) > maxWidth) {
				lines.push(line);
				line = '';
			}
			// A single word wider than the box is cut character by character.
			let w = word;
			while (width(w.trimEnd()) > maxWidth && [...w].length > 1) {
				let cut = '';
				for (const ch of w) {
					if (width(cut + ch) > maxWidth) break;
					cut += ch;
				}
				// A single glyph wider than the box still takes its own line (the canvas crops it):
				// never an empty cut, which would loop forever.
				if (!cut) cut = [...w][0];
				lines.push(cut);
				w = w.slice(cut.length);
			}
			line += w;
		}
		lines.push(line);
	}
	return lines;
}

/**
 * Draw `text` at an integer `scale` (CSS px per font pixel) in `color`, wrapped to
 * `maxCssWidth`. The backing store uses a whole number of device pixels per font pixel.
 */
export function drawBitmapText(
	canvas: HTMLCanvasElement,
	bf: LoadedBitmapFont,
	text: string,
	opts: { scale: number; color: string; maxCssWidth: number; dpr: number }
) {
	const { lineHeight } = bf.font.common;
	const k = Math.max(1, Math.round(opts.scale * opts.dpr));
	const maxWidth = Math.max(8, Math.floor(opts.maxCssWidth / opts.scale));
	const lines = layout(bf, text, maxWidth);
	const fallback = bf.chars.get(63); // « ? » for characters the atlas lacks

	// 1. Native-size buffer: glyphs copied from the atlas, then tinted.
	const w = Math.max(1, maxWidth);
	const h = Math.max(1, lines.length * lineHeight);
	const buffer = document.createElement('canvas');
	buffer.width = w;
	buffer.height = h;
	const b = buffer.getContext('2d')!;
	b.imageSmoothingEnabled = false;
	let used = 1;
	lines.forEach((line, row) => {
		let x = 0;
		let prev = -1;
		for (const ch of line) {
			const cp = ch.codePointAt(0)!;
			const c = bf.chars.get(cp) ?? fallback;
			if (!c) continue;
			x += bf.kerning.get(`${prev},${cp}`) ?? 0;
			if (c.width && c.height) {
				b.drawImage(
					bf.atlas,
					c.x,
					c.y,
					c.width,
					c.height,
					x + c.xoffset,
					row * lineHeight + c.yoffset,
					c.width,
					c.height
				);
			}
			x += c.xadvance;
			prev = cp;
		}
		used = Math.max(used, Math.min(x, w));
	});
	b.globalCompositeOperation = 'source-in';
	b.fillStyle = opts.color;
	b.fillRect(0, 0, w, h);

	// 2. Visible canvas: whole-number upscale, nearest neighbour.
	canvas.width = used * k;
	canvas.height = h * k;
	canvas.style.width = `${(used * k) / opts.dpr}px`;
	canvas.style.height = `${(h * k) / opts.dpr}px`;
	const ctx = canvas.getContext('2d')!;
	ctx.imageSmoothingEnabled = false;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(buffer, 0, 0, used, h, 0, 0, used * k, h * k);
}
