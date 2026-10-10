import { site as current, siteUrl, SITE } from '#lib/sites/config.ts';

/** Metadata of the site being built (ADR-008). */
export const site = {
	name: current.name,
	url: siteUrl(SITE),
	description: current.description,
	email: current.email,
	city: 'Mons · Paris',
	timezone: 'Europe/Paris'
};

export const nav = current.nav;

export const socials = [
	{ href: 'https://www.linkedin.com/', label: 'LinkedIn' },
	{ href: 'https://www.instagram.com/', label: 'Instagram' },
	{ href: 'https://x.com/', label: 'X' }
];
