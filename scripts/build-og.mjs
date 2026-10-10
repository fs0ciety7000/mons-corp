/**
 * Open Graph images (1200×630 JPEG) and PNG icons for the four sites.
 * Source of truth for copy: src/lib/seo/pages.json (shared with the <Seo> component).
 *
 * Tooling script, not a runtime dependency: needs Playwright and the pre-installed Chromium.
 *   PLAYWRIGHT_DIR=<dir containing node_modules/playwright> node scripts/build-og.mjs
 * Outputs: static/og/<site>-<page>.jpg, static/icons/<site>-{32,180,192,512}.png
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(
	process.env.PLAYWRIGHT_DIR ? path.join(process.env.PLAYWRIGHT_DIR, 'noop.js') : import.meta.url
);
const { chromium } = require('playwright');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = JSON.parse(fs.readFileSync(path.join(root, 'src/lib/seo/pages.json'), 'utf8'));
const nm = path.join(root, 'node_modules');
// Fonts are inlined (data URIs): a page set via setContent() cannot read file:// URLs.
const font = (p) =>
	`data:font/woff2;base64,${fs.readFileSync(path.join(nm, p)).toString('base64')}`;

const SITES = {
	holding: {
		name: 'CARDOR Media',
		signal: '#FF3B1F',
		host: 'cardormedia.com',
		icon: 'cardor-monogram'
	},
	interactive: {
		name: 'OCC Interactive',
		signal: '#C6FF3D',
		host: 'interactive.cardormedia.com',
		icon: 'interactive'
	},
	sound: {
		name: 'OCC Soundworks',
		signal: '#7B5CFF',
		host: 'sound.cardormedia.com',
		icon: 'sound'
	},
	creative: {
		name: 'OCC Creative Lab',
		signal: '#FFB547',
		host: 'creative.cardormedia.com',
		icon: 'creative'
	}
};

const svg = (name) => {
	const raw = fs.readFileSync(path.join(root, 'static/brand', `${name}.svg`), 'utf8');
	return raw.replace('<svg ', `<svg preserveAspectRatio="xMidYMid meet" `);
};

const css = `
@font-face { font-family: 'IS'; src: url(${font('@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2')}); }
@font-face { font-family: 'IS'; font-style: italic; src: url(${font('@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2')}); }
@font-face { font-family: 'GM'; src: url(${font('@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2')}); }
@font-face { font-family: 'G'; src: url(${font('@fontsource-variable/geist/files/geist-latin-wght-normal.woff2')}); }
* { margin: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; background: #07070A; color: #EDE8DF; overflow: hidden; }
.card { position: relative; width: 1200px; height: 630px; padding: 64px 72px; display: flex; flex-direction: column; }
.grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(42,42,51,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(42,42,51,.35) 1px, transparent 1px); background-size: 60px 60px; }
.glow { position: absolute; width: 760px; height: 760px; right: -160px; top: -60px; border-radius: 50%; background: radial-gradient(circle, color-mix(in oklab, var(--s) 30%, transparent) 0%, transparent 62%); }
.grain { position: absolute; inset: 0; opacity: .08; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
.kicker, .foot { font-family: 'GM'; font-size: 17px; letter-spacing: .16em; text-transform: uppercase; color: #8A8794; position: relative; }
.kicker b { color: var(--s); font-weight: 500; }
.title { position: relative; margin-top: auto; max-width: 610px; }
.occ { font-family: 'GM'; font-size: 26px; letter-spacing: .6em; color: var(--s); margin-bottom: 6px; }
h1 { font-family: 'IS'; font-weight: 400; font-size: var(--fs); line-height: .9; letter-spacing: -.03em; }
h1 i { color: var(--s); }
.sub { font-family: 'IS'; font-style: italic; font-size: 38px; margin-top: 22px; color: rgba(237,232,223,.9); }
.foot { margin-top: 44px; display: flex; align-items: center; gap: 16px; color: #EDE8DF; }
.foot .wheel { width: 34px; height: 34px; }
.foot .sep { color: #8A8794; }
.bar { position: absolute; left: 0; right: 0; bottom: 0; height: 8px; background: var(--s); }
.emblem { position: absolute; right: 64px; top: 110px; width: 420px; height: 400px; display: grid; place-items: center; }
.emblem svg { width: 100%; height: 100%; }
.family { position: absolute; right: 56px; top: 92px; width: 470px; display: grid; grid-template-columns: 1fr 1fr; gap: 26px; }
.family div { height: 196px; border: 1px solid #2A2A33; background: rgba(14,14,19,.85); padding: 26px; display: grid; place-items: center; }
.family svg { width: 100%; height: 100%; }
.wheel svg { width: 100%; height: 100%; }
`;

function card(siteId, page) {
	const s = SITES[siteId];
	const og = page.og;
	const isDivisionHome = siteId !== 'holding' && page.path === '/';
	const plain = og.heading.replace(/<[^>]+>/g, '');
	const fs_ = plain.length > 22 ? 86 : plain.length > 12 ? 112 : 150;
	const art =
		og.emblems.length > 1
			? `<div class="family">${og.emblems.map((e) => `<div>${svg(e)}</div>`).join('')}</div>`
			: `<div class="emblem">${svg(og.emblems[0])}</div>`;
	return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
<div class="card" style="--s:${s.signal}; --fs:${fs_}px">
	<div class="grid"></div><div class="glow"></div><div class="grain"></div>
	${art}
	<p class="kicker"><b>●</b> ${og.kicker}</p>
	<div class="title">
		${isDivisionHome ? '<p class="occ">OCC</p>' : ''}
		<h1>${og.heading}</h1>
		<p class="sub">${og.sub}</p>
	</div>
	<p class="foot"><span class="wheel">${svg('cardor-monogram')}</span>${s.host}${siteId !== 'holding' ? '<span class="sep">·</span>une division de CARDOR Media' : ''}</p>
	<div class="bar"></div>
</div></body></html>`;
}

function iconPage(name, signal, size) {
	return `<!doctype html><html><head><style>*{margin:0}html,body{width:${size}px;height:${size}px;background:#07070A}
div{width:100%;height:100%;display:grid;place-items:center;padding:${Math.round(size * 0.12)}px;box-sizing:border-box}
svg{width:100%;height:100%}</style></head><body><div>${svg(name)}</div></body></html>`;
}

const b = await chromium.launch({
	executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
});
fs.mkdirSync(path.join(root, 'static/og'), { recursive: true });
fs.mkdirSync(path.join(root, 'static/icons'), { recursive: true });

const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
for (const [siteId, list] of Object.entries(pages)) {
	for (const [key, page] of Object.entries(list)) {
		await p.setContent(card(siteId, page), { waitUntil: 'load' });
		await p.evaluate(() => document.fonts.ready);
		const out = path.join(root, 'static/og', `${siteId}-${key}.jpg`);
		await p.screenshot({ path: out, type: 'jpeg', quality: 88 });
		console.log('og', path.relative(root, out));
	}
}
for (const [siteId, s] of Object.entries(SITES)) {
	for (const size of [32, 180, 192, 512]) {
		const ip = await b.newPage({ viewport: { width: size, height: size } });
		await ip.setContent(iconPage(s.icon, s.signal, size));
		await ip.screenshot({ path: path.join(root, 'static/icons', `${siteId}-${size}.png`) });
		await ip.close();
	}
	console.log('icons', siteId);
}
await b.close();
