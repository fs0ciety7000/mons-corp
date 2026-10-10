import { SITE, siteUrl } from '#lib/sites/config.ts';

export const prerender = true;

/** Per-site robots.txt pointing at the site's own sitemap (ADR-008). */
export const GET = () =>
	new Response(`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl(SITE)}/sitemap.xml\n`, {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
