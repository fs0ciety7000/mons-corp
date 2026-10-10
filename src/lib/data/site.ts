import { site as current, siteUrl, SITE } from '#lib/sites/config.ts';

/** Metadata of the site being built (ADR-008). */
export const site = {
	name: current.name,
	url: siteUrl(SITE),
	description: current.description,
	email: current.email,
	city: 'Mons · Belgique',
	timezone: 'Europe/Brussels'
};

export const nav = current.nav;
