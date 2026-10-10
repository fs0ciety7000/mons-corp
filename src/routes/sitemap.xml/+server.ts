import pages from '#lib/seo/pages.json';
import { SITE, siteUrl } from '#lib/sites/config.ts';

export const prerender = true;

const BUILT = new Date().toISOString().slice(0, 10);

/** Per-site sitemap built from src/lib/seo/pages.json (same source as the meta tags). */
export const GET = () => {
	const base = siteUrl(SITE);
	const list = Object.values((pages as Record<string, Record<string, { path: string }>>)[SITE]);
	const urls = list
		.map(
			(p) =>
				`\t<url>\n\t\t<loc>${p.path === '/' ? base + '/' : base + p.path}</loc>\n\t\t<lastmod>${BUILT}</lastmod>\n\t\t<image:image><image:loc>${base}/og/${SITE}-${p.path === '/' ? 'home' : p.path.slice(1)}.jpg</image:loc></image:image>\n\t</url>`
		)
		.join('\n');
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`,
		{ headers: { 'content-type': 'application/xml; charset=utf-8' } }
	);
};
