import { SITE, site } from '#lib/sites/config.ts';

export const prerender = true;

export const GET = () =>
	new Response(
		JSON.stringify({
			name: site.name,
			short_name: SITE === 'holding' ? 'CARDOR' : SITE === 'apps' ? 'CARDOR Apps' : site.short,
			description: site.description,
			lang: 'fr-BE',
			start_url: '/',
			display: 'standalone',
			background_color: '#07070A',
			theme_color: '#07070A',
			icons: [192, 512].map((s) => ({
				src: `/icons/${SITE}-${s}.png`,
				sizes: `${s}x${s}`,
				type: 'image/png',
				purpose: 'any'
			}))
		}),
		{ headers: { 'content-type': 'application/manifest+json' } }
	);
