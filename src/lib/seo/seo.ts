import pages from './pages.json';
import { socials } from '#lib/data/social.ts';
import { SITE, site as current, siteUrl, divisionSites, type SiteId } from '#lib/sites/config.ts';

export type PageKey = 'home' | 'contact' | 'marque' | 'beffroi-8' | 'privatix-jdr';

interface PageSeo {
	path: string;
	title: string;
	description: string;
	og: { alt: string };
}

const table = pages as Record<SiteId, Partial<Record<PageKey, PageSeo>>>;

export function pageSeo(key: PageKey) {
	const p = table[SITE][key] ?? table[SITE].home!;
	const base = siteUrl(SITE);
	return {
		...p,
		url: p.path === '/' ? `${base}/` : `${base}${p.path}`,
		image: `${base}/og/${SITE}-${key}.jpg`
	};
}

const ADDRESS = {
	'@type': 'PostalAddress',
	addressLocality: 'Mons',
	addressRegion: 'Hainaut',
	addressCountry: 'BE'
};

/** schema.org graph for the site being built (Organization + WebSite). */
export function siteGraph() {
	const base = siteUrl(SITE);
	const holding = siteUrl('holding');
	const org: Record<string, unknown> = {
		'@type': 'Organization',
		'@id': `${base}/#organization`,
		name: current.name,
		url: base,
		email: current.email,
		description: current.description,
		logo: `${base}/icons/${SITE}-512.png`,
		image: `${base}/og/${SITE}-home.jpg`,
		address: ADDRESS,
		foundingLocation: { '@type': 'Place', name: 'Mons, Belgique', address: ADDRESS },
		areaServed: 'Worldwide',
		knowsLanguage: ['fr', 'en']
	};
	if (SITE === 'holding') {
		org.alternateName = 'CARDOR';
		org.sameAs = socials.map((s) => s.url);
		org.subOrganization = divisionSites.map((d) => ({
			'@type': 'Organization',
			'@id': `${siteUrl(d.id)}/#organization`,
			name: d.name,
			url: siteUrl(d.id)
		}));
	} else {
		org.parentOrganization = {
			'@type': 'Organization',
			'@id': `${holding}/#organization`,
			name: 'CARDOR Media',
			url: holding
		};
	}
	return {
		'@context': 'https://schema.org',
		'@graph': [
			org,
			{
				'@type': 'WebSite',
				'@id': `${base}/#website`,
				url: base,
				name: current.name,
				inLanguage: 'fr-BE',
				publisher: { '@id': `${base}/#organization` }
			}
		]
	};
}

/** Serialise JSON-LD safely for an inline <script>. */
export const jsonLd = (data: unknown) =>
	`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
