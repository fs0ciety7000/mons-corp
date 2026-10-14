/**
 * Catalogue of the app launcher (ADR-012): every project of src/lib/data/projects.ts, the single
 * source shared with the studios' sites and cardormedia.com. This module only adds the launcher's
 * labels and search helpers.
 */
import {
	projects,
	studios,
	type Access,
	type Project,
	type ProjectKind,
	type ProjectLink
} from '#lib/data/projects.ts';
import type { DivisionId } from '#lib/data/divisions.ts';

export type Studio = DivisionId;
export type AppKind = ProjectKind;
export type AppLink = ProjectLink;
export type AppEntry = Project;
export type { Access };

export const catalog: AppEntry[] = projects;

/** Studios in brand order. */
export { studios };

export const kindLabels: Record<AppKind, string> = {
	jeu: 'Jeu',
	app: 'Application',
	outil: 'Outil métier',
	creation: 'Création',
	site: 'Site'
};

export const accessLabels: Record<Access, string> = {
	public: 'Accès libre',
	invitation: 'Sur invitation',
	reserve: 'Accès réservé'
};

/** Lower-cased, accent-free text used by the search box. */
export const searchText = (a: AppEntry) =>
	[a.name, a.category, a.pitch, a.keywords, kindLabels[a.kind], a.platforms.join(' '), host(a.url)]
		.join(' ')
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase();

export const host = (url: string) => new URL(url).host;
